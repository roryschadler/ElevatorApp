import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';

import FloorPanel from './FloorPanel';
import CarPanel from './CarPanel';

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
  static propTypes = {
    /** Current tab value */
    value: PropTypes.string.isRequired,
    /** List of all floors */
    floors: PropTypes.arrayOf(PropTypes.string).isRequired,
    /** Callback on button click */
    onClick: PropTypes.func.isRequired,
  };

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
            onClick={this.props.onClick}
          ></FloorPanel>
        );
      },
      this
    );

    const carPanel = (
      <CarPanel floors={this.props.floors} onClick={this.props.onClick} />
    );

    if (this.props.value === 'all') { // full system display
      return (
        <Grid
          container
          columns={{ xs: 4, sm: 8, md: 12 }}
          spacing={{ xs: 2, md: 3 }}
          alignItems="stretch"
        >
          <Grid item xs={2} sm={4} md={4}>
            {carPanel}
          </Grid>

          {floorButtons.map((button, index) => (
            <Grid item xs={1} sm={2} md={2} key={index}>
              {button}
            </Grid>
          ))}
        </Grid>
      );
    } else if (this.props.value === 'car') { // elevator car only
      return carPanel;
    } else { // floor panel only
      return floorButtons[this.props.floors.indexOf(this.props.value)];
    }
  }
}

export default ElevatorDisplay;
