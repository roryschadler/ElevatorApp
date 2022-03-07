import React from 'react';
import { Button, Paper, Stack, Grid } from '@mui/material';
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
    <Paper aria-label="Elevator tracking display">
      <Grid container spacing={1} direction="column" justifyItems="center">
        <Grid item sx={{ textAlign: 'center' }}>
          Elevator Location
        </Grid>
        <Grid item>
          <Stack direction="column-reverse">
            {floors.map((floor, index) => (
              <Button
                sx={{
                  bgcolor: index === position ? 'primary.light' : 'primary',
                }}
                disableFocusRipple
                disableRipple
                key={index}
              >
                {floor}
              </Button>
            ))}
          </Stack>
        </Grid>
      </Grid>
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
