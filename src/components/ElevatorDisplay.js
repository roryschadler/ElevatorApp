import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';

import FloorPanel from './FloorPanel';
import CarPanel from './CarPanel';
import ElevatorControl from '../ElevatorControl';
import ElevatorTracker from './ElevatorTracker';

/**
 * Component for Tabbed Elevator Display
 *
 * Tab values should be passed into the `value` prop, and
 * should be `'all'`, `'car'`, or a floor label. All
 * available floors should be passed in the `floors` prop,
 * and an `onClick` callback function is required for
 * buttons to function properly.
 *
 * @component
 * @example
 * let tabValue = 'all';
 * const floors = ['L', '1', '2'];
 * const handleClick = () => console.log('click');
 * return (
 *   <ElevatorDisplay value={tabValue} floors={floors} onClick={handleClick} />
 * );
 */
class ElevatorDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /** elevator button size */
      buttonSize: 64,
      floorButtons: new Array(this.props.floors.length).fill({
        up: false,
        down: false,
      }),
      carButtons: new Array(this.props.floors.length).fill(false),
      elevatorPosition: 0,
    };
    this.handleElevatorRequest = this.handleElevatorRequest.bind(this);
    this.handleElevatorCallBack = this.handleElevatorCallBack.bind(this);
    this.handleElevatorPosition = this.handleElevatorPosition.bind(this);
    this.controller = new ElevatorControl({
      floors: this.props.floors,
      initialPosition: this.state.elevatorPosition,
      buttonCallBack: this.handleElevatorCallBack,
      positionCallBack: this.handleElevatorPosition,
      travelInterval: 5000,
      floorInterval: 10000,
    });
  }

  handleElevatorRequest(destination, currentFloor) {
    return () => {
      this.controller.requestElevator(destination, currentFloor);
    };
  }

  handleElevatorPosition(position) {
    this.setState(() => ({ elevatorPosition: position }));
  }

  handleElevatorCallBack({ type, location, button, active }) {
    this.setState((state) => {
      if (type === 'car') {
        const newCarButtons = [...state.carButtons];
        newCarButtons[location] = active;
        return { carButtons: newCarButtons };
      } else if (type === 'floor') {
        const newFloorButtons = [...state.floorButtons];
        const currentFloorButtons = newFloorButtons[location];
        newFloorButtons[location] = {
          ...currentFloorButtons,
          [button]: active,
        };
        return { floorButtons: newFloorButtons };
      }
    });
  }

  render() {
    // map floor labels to their corresponding button panels
    const floorButtons = Array.from(
      this.props.floors,
      (floor, index) => {
        let location = null;
        if (index === 0) {
          location = 'bottom';
        } else if (index === this.props.floors.length - 1) {
          location = 'top';
        }
        return (
          <FloorPanel
            location={location || ''}
            floor={floor}
            onClick={this.handleElevatorRequest}
            buttonSize={this.state.buttonSize}
            buttonsOn={this.state.floorButtons[index]}
          ></FloorPanel>
        );
      },
      this
    );

    const carPanel = (
      <CarPanel
        floors={this.props.floors}
        onClick={this.handleElevatorRequest}
        buttonSize={this.state.buttonSize}
        buttonsOn={this.state.carButtons}
      />
    );

    if (this.props.value === 'all') {
      // full system display
      return (
        <Grid
          container
          columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
          spacing={{ xs: 1, md: 3 }}
        >
          <Grid xs={2} item>
            <ElevatorTracker
              floors={this.props.floors}
              position={this.state.elevatorPosition}
            />
          </Grid>
          <Grid xs={3} item>
            {carPanel}
          </Grid>

          {floorButtons.map((button, index) => (
            <Grid item xs key={index}>
              {button}
            </Grid>
          ))}
        </Grid>
      );
    } else if (this.props.value === 'car') {
      // elevator car only
      return carPanel;
    } else {
      // floor panel only
      return floorButtons[this.props.floors.indexOf(this.props.value)];
    }
  }
}

ElevatorDisplay.propTypes = {
  /** Current tab value */
  value: PropTypes.string.isRequired,
  /** List of all floors */
  floors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ElevatorDisplay;
