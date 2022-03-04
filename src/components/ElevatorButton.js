import React from 'react';
import PropTypes from 'prop-types';
import { Fab } from '@mui/material';

/**
 * Component for individual Elevator Button.
 *
 * Include a child element for display inside the button.
 *
 * @component
 * @example
 * const handleClick = () => console.log('click');
 * const buttonText = 6;
 * const buttonSize = 64;
 * return (
 *   <ElevatorButton onClick={handleClick} buttonSize={buttonSize}>{buttonText}</ElevatorButton>
 * );
 */
function ElevatorButton({ onClick, buttonSize, children }) {
  return (
    <Fab color="primary" sx={{ boxShadow: 3, height: buttonSize, width: buttonSize }} onClick={onClick}>
      {children}
    </Fab>
  );
}

ElevatorButton.propTypes = {
  /** Callback on button click */
  onClick: PropTypes.func.isRequired,
  /** Element to insert inside the button */
  children: PropTypes.node.isRequired,
  /** Button size */
  buttonSize: PropTypes.number.isRequired,
};

export default ElevatorButton;
