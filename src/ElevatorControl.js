import SortedArraySet from 'collections/sorted-array-set';

/**
 * Up direction flag.
 * @typedef {number} UP
 */
const UP = 1;

/**
 * Down direction flag.
 * @typedef {number} DOWN
 */
const DOWN = -1;

/**
 * Elevator Controller object
 *
 * Contains the logic for the Elevator Application. Provides a request
 * function for ElevatorButtons to use as a callback, and then manages
 * fulfilling each request according to a few rules:
 *
 * * Floor buttons summon the elevator to that floor
 * * Inside buttons send the elevator to their labeled floor
 * * If a button is pressed that is in line with the current
 *   direction of the elevator, it will stop at that floor
 * * If a button is pressed that is _not_ in line with the current
 *   direction of the elevator, it will complete all compatible
 *
 * @example
 * const floors = ['L', '1', '2', '3'];
 * const travelInterval = 1000;
 * const floorInterval = 2000;
 * const controller = new ElevatorControl(
 *   floors,
 *   travelInterval,
 *   floorInterval
 * );
 */

class ElevatorControl {
  /**
   * @constructor
   * @param {string[]} floors Floor labels in order
   * @param {ElevatorControl~buttonCallBack} [buttonCallBack] - Function to call
   * on receiving a request and on elevator arrival
   * @param {number} [travelInterval] - Time between floors in ms
   * @param {number} [floorInterval] - Time to stop at a floor in ms
   */
  constructor(floors, buttonCallBack, travelInterval, floorInterval) {
    this.floors = floors;
    this.pendingUp = new SortedArraySet([], equalRequests, compareRequests);
    this.pendingDown = new SortedArraySet([], equalRequests, compareRequests);
    this.current = new SortedArraySet([], equalRequests, compareRequests);
    this.car = {
      location: 0,
      direction: UP,
      busy: false,
    };
    this.travelInterval = travelInterval || 5000;
    this.floorInterval = floorInterval || 10000;
    this.currentTimeoutID = null;
    this.buttonCallBack = buttonCallBack || ((announcement) => {});

    this.moveCar = this.moveCar.bind(this);
  }

  /**
   * This callback informs the caller of each received request, and on each
   * requested floor arrival.
   * @callback ElevatorControl~buttonCallBack
   * @param {Object} announcement - Elevator announcement of request received or
   *   arrival made.
   * @param {string} announcement.source - Either 'car' or 'floor' depending on
   *   the source of the request. Always 'car' for arrival calls.
   * @param {number} announcement.destination - Index of floors array
   *   corresponding to the request location/destination, or the arrival floor
   * @param {string} announcement.direction - Direction of request received,
   *   or direction the car was traveling before floor arrival. `null` if
   *   responding to a 'car' request.
   */

  /**
   * Request the elevator to a given floor or direction.
   * @param {string} destination - 'up' or 'down', or a floor label
   * @param {string} [currentFloor] - floor label if destination is 'up' or
   *   'down'
   */
  requestElevator(destination, currentFloor) {
    let request = {};
    if (
      currentFloor !== undefined &&
      (destination === 'up' || destination === 'down')
    ) {
      request = {
        source: 'floor',
        requestDirection: destination,
        travelDirection: destination === 'up' ? UP : DOWN,
        destination: this.floors.indexOf(currentFloor),
      };
      console.log(
        `Request to go ${
          request.travelDirection === UP ? 'up' : 'down'
        } from floor ${this.floors[request.destination]}`
      );
    } else {
      request = {
        source: 'car',
        destination: this.floors.indexOf(destination),
      };
      console.log(`Request to go to floor ${this.floors[request.destination]}`);
    }
    this.registerElevatorRequest(request);
    this.buttonCallBack({
      source: request.source,
      destination: request.destination,
      direction: request.requestDirection || null,
    });
  }

  /**
   * Assigns the request to the correct queue.
   * @param {Object.<string, (string|number)>} request - Request object for
   *   elevator control.
   */
  registerElevatorRequest(request) {
    // car idle, apply new job right away
    if (!this.car.busy) {
      this.car.busy = true;
      this.car.direction = this.getTravelDirection(request.destination);
      this.current.add(request);
      this.tick();
    } else {
      // car is busy, check if request is on the way
      if (request.source === 'floor') {
        if (request.travelDirection === this.car.direction) {
          if (
            this.car.direction === UP &&
            request.destination < this.car.location
          ) {
            // going up, but floor is below location
            this.pendingUp.add(request);
          } else if (
            this.car.direction === DOWN &&
            request.destination > this.car.location
          ) {
            // going down, but floor is above location
            this.pendingDown.add(request);
          } else {
            // direction matches and floor is upcoming
            this.current.add(request);
          }
        } else {
          // direction doesn't match
          if (request.travelDirection === UP) {
            this.pendingUp.add(request);
          } else if (request.travelDirection === DOWN) {
            this.pendingDown.add(request);
          }
        }
      } else if (request.source === 'car') {
        if (
          this.car.direction === UP &&
          request.destination < this.car.location
        ) {
          // going up, but floor is below location
          this.pendingDown.add(request);
        } else if (
          this.car.direction === DOWN &&
          request.destination > this.car.location
        ) {
          // going down, but floor is above location
          this.pendingUp.add(request);
        } else {
          // floor is upcoming
          this.current.add(request);
        }
      }
    }
  }

  /**
   * Move elevator towards target floor, waiting where necessary.
   * @param {Object.<string, (string|number)>} stop - Request object for
   *   elevator control.
   */
  async handleRequest(stop) {
    while (stop.destination !== this.car.location) {
      await sleep(this.travelInterval);
      this.moveCar(this.getTravelDirection(stop.destination));
    }
    console.log(`Stopping at floor '${this.floors[this.car.location]}'`);
    this.buttonCallBack({
      source: 'car',
      destination: this.car.location,
      direction: this.car.direction === UP ? 'up' : 'down',
    });
    await sleep(this.floorInterval);
  }

  /**
   * Returns the direction of the target floor from the elevator car.
   * @param {number} targetFloor - target floor index
   * @returns UP or DOWN
   */
  getTravelDirection(targetFloor) {
    return targetFloor > this.car.location ? UP : DOWN;
  }

  /**
   * Control loop of the elevator. Manages the active queue and calls
   * the next stop.
   */
  async tick() {
    if (this.current.length > 0) {
      let nextStop;
      if (this.car.direction === UP) {
        nextStop = this.current.shift();
        await this.handleRequest(nextStop);
        if (this.current.length <= 0) {
          // we're out of current up jobs
          if (this.pendingDown.length > 0) {
            // if there are down jobs, add them and switch directions
            this.current = this.pendingDown;
            this.car.direction = DOWN;
          } else if (this.pendingUp.length > 0) {
            // we have pending up jobs below us but no pending down jobs
            this.current = this.pendingUp;
          } else {
            // no requests right now
            this.car.busy = false;
          }
        }
      } else if (this.car.direction === DOWN) {
        nextStop = this.current.pop();
        await this.handleRequest(nextStop);
        if (this.current.length <= 0) {
          // we're out of current down jobs
          if (this.pendingUp.length > 0) {
            // if there are up jobs, add them and switch directions
            this.current = this.pendingUp;
            this.car.direction = UP;
          } else if (this.pendingDown.length > 0) {
            // we have pending down jobs below us but no pending up jobs
            this.current = this.pendingDown;
          } else {
            // no requests right now
            this.car.busy = false;
          }
        }
      }
      this.tick();
    }
  }

  /**
   * Moves the elevator one step in the given direction. Checks to see if there
   * are any requests for the current location, and handles them if so.
   * @param {(UP|DOWN)} direction - Direction to travel
   */
  async moveCar(direction) {
    if (direction === UP) {
      this.car.location++;
    } else if (direction === DOWN) {
      this.car.location--;
    }
    console.log(`Elevator at floor '${this.floors[this.car.location]}'`);
    const currentLocation = { destination: this.car.location };
    if (this.current.has(currentLocation)) {
      await this.handleRequest(this.current.get(currentLocation));
      this.current.delete(currentLocation);
    }
  }
}

/**
 * Comparator for request objects.
 * @param {Object.<string, (string|number)>} a - First request to compare
 * @param {Object.<string, (string|number)>} b - Second request to compare
 * @returns a < b
 */
function compareRequests(a, b) {
  return a.destination - b.destination;
}

/**
 * Equality tester for request objects.
 * @param {Object.<string, (string|number)>} a - First request to compare
 * @param {Object.<string, (string|number)>} b - Second request to compare
 * @returns a === b
 */
function equalRequests(a, b) {
  return a.destination === b.destination;
}

/**
 * Utility function for waiting for elevator motion.
 * @param {number} ms - Time to wait
 * @returns Promise that resolves in the given time
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default ElevatorControl;
