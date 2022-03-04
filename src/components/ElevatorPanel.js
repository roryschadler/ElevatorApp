import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Stack, Paper } from '@mui/material';

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
class ElevatorPanel extends React.Component {
  constructor(props) {
    super(props);
    this.splitColumns = this.splitColumns.bind(this);
  }
  static propTypes = {
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

  static defaultProps = {
    /** Display label by default */
    noText: false,
    /** Don't reverse buttons by default */
    reverse: false,
  };

  /**
   * Splits an array of children into even-sized chunks so that the
   * final display is roughly square. Does nothing if there are 4 or fewer
   * children, and leaves the last group ragged if necessary.
   * @param {Array(PropTypes.node) || PropTypes.node} children Child element(s)
   * @returns Array of children split into chunks
   */
  splitColumns(children) {
    const resultColumns = [];
    if (Array.isArray(children)) {
      const chunkSize =
        children.length > 4 ? Math.ceil(Math.sqrt(children.length)) : 4;

      for (let floor = 0; floor < children.length; floor += chunkSize) {
        resultColumns.push(children.slice(floor, floor + chunkSize));
      }
    } else {
      resultColumns.push(children);
    }

    return resultColumns.map((item, index) => (
      <Grid item key={`col${index}`}>
        <Stack
          direction={this.props.reverse ? 'column-reverse' : 'column'}
          spacing={1}
        >
          {item}
        </Stack>
      </Grid>
    ));
  }

  render() {
    // add custom class if passed
    const className = ['elevator_panel'];
    if (Array.isArray(this.props.className)) {
      className.push(...this.props.className);
    } else if (this.props.className) {
      className.push(this.props.className);
    }
    // label
    const textItem =
      !this.props.noText && this.props.text ? (
        <Grid item sx={{ textAlign: 'center' }}>
          {this.props.text}
        </Grid>
      ) : null;

    return (
      <Paper className={className.join(' ')}>
        <Grid container spacing={1} direction="column" justifyItems="center">
          {textItem}
          <Grid
            container
            item
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            {this.splitColumns(this.props.children)}
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default ElevatorPanel;
