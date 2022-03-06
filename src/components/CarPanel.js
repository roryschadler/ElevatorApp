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
 * const buttonSize = 64;
 * const buttonsOn = [false, false, false];
 * return (
 *   <CarPanel
 *     floors={floors}
 *     onClick={handleClick}
 *     buttonSize={buttonSize}
 *     buttonsOn={buttonsOn}
 *   />
 * );
 */
function CarPanel({ floors, onClick, noText, buttonSize, buttonsOn }) {
  // map given floors to buttons
  const buttonList = floors.map((floor, index) => (
    <ElevatorButton
      onClick={onClick(floor)}
      key={floor}
      buttonSize={buttonSize}
      active={buttonsOn[index]}
      label={`Car button for floor ${floor}`}
    >
      {floor}
    </ElevatorButton>
  ));
  return (
    <ElevatorPanel
      text="Elevator Car"
      reverse
      noText={noText}
      className="car_panel"
      buttonSize={buttonSize}
      label="Elevator Car Panel"
    >
      {buttonList}
    </ElevatorPanel>
  );
}

CarPanel.propTypes = {
  /** Array of string floor labels. */
  floors: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Callback on button click */
  onClick: PropTypes.func.isRequired,
  /** Pass if no label is desired */
  noText: PropTypes.bool,
  /** Button size for appropriate panel sizing */
  buttonSize: PropTypes.number.isRequired,
  /** Array of button activity flags */
  buttonsOn: PropTypes.arrayOf(PropTypes.bool).isRequired,
};

CarPanel.defaultProps = {
  /** Show label by default */
  noText: false,
};

export default CarPanel;
