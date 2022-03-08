import SortedArraySet from 'collections/sorted-array-set';
import EventEmitter from 'events';

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
 * Contains the logic for the Elevator Application. Provides a request function
 * for ElevatorButtons to use as a callback, and then manages fulfilling each
 * request according to a few rules:
 *
 * 1. Floor buttons summon the elevator to that floor
 * 2. Inside buttons send the elevator to their labeled floor
 * 3. If a button is pressed that is in line with the currentRequests direction
 *   of the elevator, it will stop at that floor
 * 4. If a button is pressed that is _not_ in line with the currentRequests
 *   direction of the elevator, it will complete all compatible stops first
 *
 * If provided with a button callback, it calls it on every received request and
 * every floor arrival.
 *
 * @example
 * const floors = ['L', '1', '2', '3'];
 * const buttonCallBack = (buttonChange) => console.log(buttonChange);
 * const positionCallBack = (position) => console.log(position);
 * const travelInterval = 1000;
 * const floorInterval = 2000;
 * const controller = new ElevatorControl(
 *   floors,
 *   buttonCallback,
 *   travelInterval,
 *   floorInterval
 * );
 */

class ElevatorControl {
  /**
   * @constructor
   * @param {string[]} floors - Floor labels in order
   * @param {number} initialPosition - Initial elevator position as an index of
   *   the floors array.
   * @param {buttonCallBack} [buttonCallBack] - Function to call on receiving a
   *   request and on elevator arrival
   * @param {positionCallBack} [positionCallBack] - Function to call when the
   *   elevator moves
   * @param {number} [travelInterval] - Time between floors in ms
   * @param {number} [floorInterval] - Time to stop at a floor in ms
   */
  constructor({
    floors,
    initialPosition,
    buttonCallBack,
    positionCallBack,
    travelInterval,
    floorInterval,
  }) {
    this.floors = floors;
    this.buttonCallBack = buttonCallBack || (() => {});
    this.positionCallBack = positionCallBack || (() => {});
    this.travelInterval = travelInterval || 5000;
    this.floorInterval = floorInterval ? Math.floor(floorInterval * 0.7) : 8000;
    this.doorInterval = floorInterval ? Math.floor(floorInterval * 0.15) : 1500;

    this.pendingUpRequests = new SortedArraySet(
      [],
      equalRequests,
      compareRequests
    );
    this.pendingDownRequests = new SortedArraySet(
      [],
      equalRequests,
      compareRequests
    );
    this.currentRequests = new SortedArraySet(
      [],
      equalRequests,
      compareRequests
    );
    this.activeRequest = {};
    this.abortEmitter = new EventEmitter();

    this.car = {
      location: initialPosition,
      direction: UP,
      busy: false,
    };

    this.positionCallBack(0);

    this.moveCar = this.moveCar.bind(this);
  }

  /**
   * This callback informs the caller of each received request, and on each
   * requested floor arrival.
   * @callback buttonCallBack
   * @param {Object} buttonChange - Elevator announcement of request received or
   *   arrival made.
   * @param {string} buttonChange.type - Either 'car' or 'floor' depending on
   *   the source of the request. Always 'car' for arrival calls.
   * @param {number} buttonChange.location - Index of floors array
   *   corresponding to the request location/destination, or the arrival floor
   * @param {string} [buttonChange.button] - If the type is 'floor', this
   *   contains 'up' or 'down' depending on which button should change.
   * @param {boolean} buttonChange.active - `true` if button should be active,
   *   `false` if not
   */

  /**
   * This callback informs the caller of the elevator's current position.
   * @callback positionCallBack
   * @param {number} position - Elevator's current position
   */

  /**
   * Handles the given elevator callback, providing the correct information to
   * toggle button lights.
   * @param {Object} request - Elevator request object
   * @param {string} request.source - Either 'car' or 'floor' depending on
   *   the source of the request.
   * @param {number} request.destination - Index of floors array corresponding
   *   to the request location/destination, or the arrival floor
   * @param {string} [request.direction] - If the type is 'floor' or arrival is
   *   true, this contains 'up' or 'down' depending on which button should
   *   change.
   * @param {boolean} [request.arrival] - `true` if this request is for a floor
   *   arrival.
   */
  handleElevatorCallBack({ source, destination, direction, arrival }) {
    if (source === 'car') {
      if (arrival) {
        // We have arrived at a floor. Turn off both car button and floor button
        this.buttonCallBack({
          type: 'car',
          location: destination,
          active: false,
        });
        this.buttonCallBack({
          type: 'floor',
          location: destination,
          button: direction,
          active: false,
        });
      } else {
        // Responding to car button press, not arrival. Turn on the car button
        this.buttonCallBack({
          type: 'car',
          location: destination,
          active: true,
        });
      }
    } else if (source === 'floor') {
      // Responding to floor button press. Turn on the floor button in the right
      // direction
      this.buttonCallBack({
        type: 'floor',
        location: destination,
        button: direction,
        active: true,
      });
    }
  }

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
      // Floor request
      request = {
        source: 'floor',
        direction: destination,
        travelDirection: destination === 'up' ? UP : DOWN,
        destination: this.floors.indexOf(currentFloor),
      };
      console.log(
        `Request to go ${request.direction} from floor ${
          this.floors[request.destination]
        }`
      );
    } else {
      // car request
      request = {
        source: 'car',
        destination: this.floors.indexOf(destination),
      };
      console.log(`Request to go to floor ${this.floors[request.destination]}`);
    }
    this.registerElevatorRequest(request);
    this.handleElevatorCallBack(request);
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
      this.car.direction = this.getTravelDirection(request);
      this.currentRequests.add(request);
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
            this.pendingUpRequests.add(request);
          } else if (
            this.car.direction === DOWN &&
            request.destination > this.car.location
          ) {
            // going down, but floor is above location
            this.pendingDownRequests.add(request);
          } else {
            // direction matches and floor is upcoming
            this.currentRequests.add(request);
          }
        } else {
          // direction doesn't match
          if (request.travelDirection === UP) {
            this.pendingUpRequests.add(request);
          } else if (request.travelDirection === DOWN) {
            this.pendingDownRequests.add(request);
          }
        }
      } else if (request.source === 'car') {
        if (
          this.car.direction === UP &&
          request.destination < this.car.location
        ) {
          // going up, but floor is below location
          this.pendingDownRequests.add(request);
        } else if (
          this.car.direction === DOWN &&
          request.destination > this.car.location
        ) {
          // going down, but floor is above location
          this.pendingUpRequests.add(request);
        } else {
          // floor is upcoming
          if (
            this.activeRequest?.travelDirection &&
            this.activeRequest.travelDirection !== this.car.direction
          ) {
            // active request would turn the elevator around before fulfilling
            // this new request -- against rule #4 of the class
            if (this.activeRequest.travelDirection === UP) {
              this.pendingUpRequests.add(this.activeRequest);
            } else if (this.activeRequest.travelDirection === DOWN) {
              this.pendingDownRequests.add(this.activeRequest);
            }
            // abort current job, it's been added to the pending queue
            this.abortEmitter.emit('abort');
            this.activeRequest = { abort: true };
          }
          this.currentRequests.add(request);
        }
      }
    }
    // request has been registered with no errors. remove AbortEmitter listeners
    // to avoid memory leak warnings
    this.abortEmitter.removeAllListeners();
  }

  /**
   * Move elevator towards target floor, waiting where necessary.
   * @param {Object.<string, (string|number)>} stop - Request object for
   *   elevator control.
   */
  async handleRequest(stop) {
    while (stop.destination !== this.car.location) {
      await this.sleep(this.travelInterval);
      if (this.activeRequest.abort) {
        // timer ended by abort, stop handling this request
        return;
      }
      this.moveCar(this.getTravelDirection(stop));
    }

    console.log(`Stopping at floor ${this.floors[this.car.location]}`);
    await this.sleep(this.doorInterval);
    this.handleElevatorCallBack({
      source: 'car',
      destination: this.car.location,
      direction: this.car.direction === UP ? 'up' : 'down',
      arrival: true,
    });
    await this.sleep(this.floorInterval + this.doorInterval);
  }

  /**
   * Returns the direction of the target floor from the elevator car.
   * @param {Object} request - Request to get direction for
   * @param {(UP|DOWN)} request.destination - destination to get direction for
   * @param {(UP|DOWN)} [request.travelDirection] - User's requested direction,
   *   may be different than the direction to the destination
   * @returns UP or DOWN
   */
  getTravelDirection(request) {
    // if the car is already at the destination, respond with the user's
    // requested direction instead
    if (request.destination === this.car.location && request.travelDirection) {
      return request.travelDirection;
    } else {
      return request.destination > this.car.location ? UP : DOWN;
    }
  }

  /**
   * Control loop of the elevator. Manages the active queue and calls
   * the next stop.
   */
  async tick() {
    if (this.currentRequests.length > 0) {
      if (this.car.direction === UP) {
        this.activeRequest = this.currentRequests.shift();
        await this.handleRequest(this.activeRequest);
        if (this.currentRequests.length <= 0) {
          // we're out of currentRequests up jobs
          if (this.pendingDownRequests.length > 0) {
            // if there are down jobs, add them and switch directions
            this.currentRequests = this.pendingDownRequests;
            this.car.direction = DOWN;
          } else if (this.pendingUpRequests.length > 0) {
            // we have pending up jobs below us but no pending down jobs
            this.currentRequests = this.pendingUpRequests;
          } else {
            // no requests right now
            this.car.busy = false;
            this.activeRequest = {};
          }
        }
      } else if (this.car.direction === DOWN) {
        this.activeRequest = this.currentRequests.pop();
        await this.handleRequest(this.activeRequest);
        if (this.currentRequests.length <= 0) {
          // we're out of currentRequests down jobs
          if (this.pendingUpRequests.length > 0) {
            // if there are up jobs, add them and switch directions
            this.currentRequests = this.pendingUpRequests;
            this.car.direction = UP;
          } else if (this.pendingDownRequests.length > 0) {
            // we have pending down jobs below us but no pending up jobs
            this.currentRequests = this.pendingDownRequests;
          } else {
            // no requests right now
            this.car.busy = false;
            this.activeRequest = {};
          }
        }
      }
      this.tick();
    }
  }

  /**
   * Moves the elevator one step in the given direction. Checks to see if there
   * are any requests for the currentRequests location, and handles them if so.
   * @param {(UP|DOWN)} direction - Direction to travel
   */
  async moveCar(direction) {
    if (direction === UP) {
      this.car.location++;
    } else if (direction === DOWN) {
      this.car.location--;
    }
    this.positionCallBack(this.car.location);
    console.log(`Elevator at floor ${this.floors[this.car.location]}`);

    // if a request has been added at the current location, handle it. The
    // request registration process guarantees it is in the correct direction.
    const currentLocation = { destination: this.car.location };
    if (this.currentRequests.has(currentLocation)) {
      await this.handleRequest(this.currentRequests.get(currentLocation));
      this.currentRequests.delete(currentLocation);
    }
  }

  /**
   * Utility function for waiting for elevator motion.
   * @param {number} ms - Time to wait
   * @returns Promise that resolves in the given time
   */
  sleep(ms) {
    return new Promise((resolve) => {
      let currentTimeoutID = setTimeout(resolve, ms);
      // allow for mid-sleep abort if called
      this.abortEmitter.on('abort', () => {
        clearTimeout(currentTimeoutID);
        resolve();
      });
    });
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

export default ElevatorControl;
