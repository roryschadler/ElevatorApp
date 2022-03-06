import React from 'react';
import { Button, Paper, Stack } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Component for the Elevator tracker.
 *
 * Displays the given floors, and highlights the current elevator position.
 *
 * @component
 * @example
 * const floors = ['L', '1', '2'];
 * const position = 0;
 * return (
 *   <ElevatorTracker floors={floors} position={position} />
 * );
 */
function ElevatorTracker({ floors, position }) {
  return (
    <Paper>
      <Stack direction="column-reverse">
        {floors.map((floor, index) => (
          <Button
            sx={{
              bgcolor: index === position ? 'primary.light' : 'primary',
            }}
            // variant="outlined"
            disableRipple
            key={index}
          >
            {floor}
          </Button>
        ))}
      </Stack>
    </Paper>
  );
}

ElevatorTracker.propTypes = {
  /** floors to display */
  floors: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** current position of the elevator car as an index of the floors array */
  position: PropTypes.number,
};

export default ElevatorTracker;
