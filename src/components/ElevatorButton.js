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
 * return (
 *   <ElevatorButton onClick={handleClick}>{buttonText}</ElevatorButton>
 * );
 */
function ElevatorButton({ onClick, children }) {
  return (
    <Fab color="primary" sx={{ boxShadow: 3 }} onClick={onClick}>
      {children}
    </Fab>
  );
}

ElevatorButton.propTypes = {
  /** Callback on button click */
  onClick: PropTypes.func.isRequired,
  /** Element to insert inside the button */
  children: PropTypes.node.isRequired,
};

export default ElevatorButton;
