import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Fab } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

class ElevatorButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  };

  handleChange(e) {
    this.props.onClick();
  }

  render() {
    let icon;
    if (this.props.text === 'up') {
      icon = <ArrowUpward></ArrowUpward>;
    } else if (this.props.text === 'down') {
      icon = <ArrowDownward></ArrowDownward>;
    } else {
      icon = <span>{this.props.text}</span>;
    }
    return (
      <Grid item>
        <Fab
          color='primary'
          sx={{ boxShadow: 3 }}
          aria-label={this.props.text}
          onClick={this.handleChange}
        >
          {icon}
        </Fab>
      </Grid>
    );
  }
}

export default ElevatorButton;
