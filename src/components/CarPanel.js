import React from 'react';
import PropTypes from 'prop-types';

import ElevatorPanel from './ElevatorPanel';
import ElevatorButton from './ElevatorButton';

/**
 * Component for the Elevator Car button panel.
 *
 * Displays a button for every floor, and passes on an event
 * handler for each from the caller.
 *
 * Displays a label by default, pass the `noText` prop to remove
 * it.
 *
 * @component
 * @example
 * const handleClick = () => console.log('click');
 * const floors = ['L', '1', '2'];
 * return (
 *   <CarPanel floors={floors} onClick={handleClick} />
 * );
 */
class CarPanel extends React.Component {
  constructor(props) {
    super(props);
    this.floorCount = parseInt(this.props.floors) || 0;
  }
  static propTypes = {
    /** Array of string floor labels. */
    floors: PropTypes.arrayOf(PropTypes.string).isRequired,
    /** Callback on button click */
    onClick: PropTypes.func.isRequired,
    /** Pass if no label is desired */
    noText: PropTypes.bool,
  };

  static defaultProps = {
    /** Show label by default */
    noText: false,
  };

  render() {
    // map given floors to buttons
    const buttonList = this.props.floors.map((floor) => (
      <ElevatorButton onClick={this.props.onClick(floor)} key={floor}>
        {floor}
      </ElevatorButton>
    ));
    return (
      <ElevatorPanel
        text="Elevator Car"
        reverse
        noText={this.props.noText}
        className="car_panel"
      >
        {buttonList}
      </ElevatorPanel>
    );
  }
}

export default CarPanel;
