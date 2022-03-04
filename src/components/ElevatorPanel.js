import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper } from '@mui/material';

/**
 * General component for Elevator button panels.
 *
 * All children are treated as buttons to be displayed in a
 * compact manner (as close to a square as possible). Pass
 * the `reverse` prop to reverse the order of the children.
 * Pass the `noText` prop or don't pass the `text` prop
 * to remove the label.
 *
 * @component
 * @example
 * const handleClick = () => console.log('click');
 * const className = 'elevator_panel';
 * const text = 'Elevator Panel';
 * const buttons = [
 *   <ElevatorButton onClick={handleClick}>1</ElevatorButton>,
 *   <ElevatorButton onClick={handleClick}>2</ElevatorButton>
 * ];
 * return (
 *   <ElevatorPanel className={className} text={text} reverse>
 *     {buttons}
 *   </ElevatorPanel>
 * );
 */
function ElevatorPanel({ children, noText, text, reverse, className }) {
  // add custom class if passed
  const classNames = ['elevator_panel'];
  if (Array.isArray(className)) {
    classNames.push(...className);
  } else if (className) {
    classNames.push(className);
  }
  // label
  const textItem =
    !noText && text ? (
      <Grid item sx={{ textAlign: 'center' }}>
        {text}
      </Grid>
    ) : null;

  let childButtons = [];
  if (Array.isArray(children)) {
    childButtons = children.map((child, index) => (
      <Grid item key={index}>
        {child}
      </Grid>
    ));
  } else {
    childButtons.push(
      <Grid item key="0">
        {children}
      </Grid>
    );
  }

  const chunkSize = childButtons.length > 4 ? Math.floor(Math.sqrt(childButtons.length)) + 1 : 4;
  const minWidth = Math.ceil(childButtons.length / chunkSize);

  return (
    <Paper className={classNames.join(' ')} sx={{ minWidth: minWidth*64 }}>
      <Grid container spacing={1} direction="column" justifyItems="center">
        {textItem}
        <Grid
          container
          item
          spacing={1}
          alignItems="center"
          justifyContent="center"
          direction={reverse ? 'column-reverse' : 'column'}
          sx={{ maxHeight: chunkSize*100 }}
        >
          {childButtons}
        </Grid>
      </Grid>
    </Paper>
  );
}

ElevatorPanel.propTypes = {
  /** Child elements to display as buttons */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  /** Pass if no label is desired */
  noText: PropTypes.bool,
  /** Text for a label */
  text: PropTypes.string,
  /** Pass to reverse the button order */
  reverse: PropTypes.bool,
  /** Custom class name(s) */
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

ElevatorPanel.defaultProps = {
  /** Display label by default */
  noText: false,
  /** Don't reverse buttons by default */
  reverse: false,
};

export default ElevatorPanel;
