import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Fab } from '@mui/material';

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
class ElevatorButton extends React.Component {
  static propTypes = {
    /** Callback on button click */
    onClick: PropTypes.func.isRequired,
    /** Element to insert inside the button */
    children: PropTypes.node.isRequired,
  };

  render() {
    let icon;
    if (this.props.children) {
      icon = this.props.children;
    }
    return (
      <Grid item>
        <Fab color="primary" sx={{ boxShadow: 3 }} onClick={this.props.onClick}>
          {icon}
        </Fab>
      </Grid>
    );
  }
}

export default ElevatorButton;
