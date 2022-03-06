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
 * const buttonSize = 64;
 * const buttonsOn = {up: false, down: false};
 * return (
 *   <FloorPanel
 *     floor={floor}
 *     location={location}
 *     onClick={handleClick}
 *     noText
 *     buttonSize={buttonSize}
 *     buttonsOn={buttonsOn}
 *   />
 * );
 */
function FloorPanel({
  floor,
  location,
  noText,
  onClick,
  buttonSize,
  buttonsOn,
}) {
  const panelProps = {
    noText,
    text: floor !== undefined ? `Floor ${floor}` : '',
    className: 'floor_panel',
    buttonSize,
    label: `Floor ${floor} panel`,
  };
  const upButton = (
    <ElevatorButton
      onClick={onClick('up', floor)}
      buttonSize={buttonSize}
      active={buttonsOn.up}
      label={`Floor ${floor} up button`}
    >
      <ArrowUpward />
    </ElevatorButton>
  );
  const downButton = (
    <ElevatorButton
      onClick={onClick('down', floor)}
      buttonSize={buttonSize}
      active={buttonsOn.down}
      label={`Floor ${floor} down button`}
    >
      <ArrowDownward />
    </ElevatorButton>
  );

  // only one button for top, bottom
  if (location) {
    if (location === 'top') {
      return <ElevatorPanel {...panelProps}>{downButton}</ElevatorPanel>;
    } else if (location === 'bottom') {
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

FloorPanel.propTypes = {
  /** Floor label */
  floor: PropTypes.string,
  /** Designate top and bottom floor */
  location: PropTypes.string,
  /** Pass if no label is desired */
  noText: PropTypes.bool,
  /** Callback on button click */
  onClick: PropTypes.func.isRequired,
  /** Button size for appropriate panel sizing */
  buttonSize: PropTypes.number.isRequired,
  /** Button activity flags */
  buttonsOn: PropTypes.shape({ up: PropTypes.bool, down: PropTypes.bool }),
};

FloorPanel.defaultProps = {
  /** Show label by default */
  noText: false,
};

export default FloorPanel;
