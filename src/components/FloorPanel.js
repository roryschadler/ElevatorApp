import React from 'react';
import PropTypes from 'prop-types';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

import ElevatorPanel from './ElevatorPanel';
import ElevatorButton from './ElevatorButton';

/**
 * Component for the Elevator Floor button panel.
 *
 * Displays a button for going up and going down (or just one
 * for the top and bottom floors), and passes on an event
 * handler for each from the caller. The top and bottom floor
 * are designated by the location prop.
 *
 * Displays a label by default, pass the `noText` prop to remove it.
 *
 * @component
 * @example
 * const handleClick = () => console.log('click');
 * const floor = '6';
 * const location = 'top';
 * return (
 *   <FloorPanel floor={floor} location={location} onClick={handleClick} noText />
 * );
 */
class FloorPanel extends React.Component {
  static propTypes = {
    /** Floor label */
    floor: PropTypes.string,
    /** Designate top and bottom floor */
    location: PropTypes.string,
    /** Pass if no label is desired */
    noText: PropTypes.bool,
    /** Callback on button click */
    onClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    /** Show label by default */
    noText: false,
  };

  render() {
    const panelProps = {
      noText: this.props.noText,
      text: this.props.floor !== undefined ? `Floor ${this.props.floor}` : '',
      className: 'floor_panel',
    };
    const upButton = (
      <ElevatorButton
        onClick={this.props.onClick('up', this.props.floor)}
      ><ArrowUpward /></ElevatorButton>
    );
    const downButton = (
      <ElevatorButton
        onClick={this.props.onClick('down', this.props.floor)}
      ><ArrowDownward /></ElevatorButton>
    );

    // only one button for top, bottom
    if (this.props.location) {
      if (this.props.location === 'top') {
        return <ElevatorPanel {...panelProps}>{downButton}</ElevatorPanel>;
      } else if (this.props.location === 'bottom') {
        return <ElevatorPanel {...panelProps}>{upButton}</ElevatorPanel>;
      }
    } else {
      return (
        <ElevatorPanel {...panelProps}>
          {upButton}
          {downButton}
        </ElevatorPanel>
      );
    }
  }
}

export default FloorPanel;
