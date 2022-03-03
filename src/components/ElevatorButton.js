import React from "react";
import PropTypes from "prop-types";
import Fab from "@mui/material/Fab";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

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
    if (this.props.text === "up") {
      icon = <ArrowUpwardIcon></ArrowUpwardIcon>;
    } else if (this.props.text === "down") {
      icon = <ArrowDownwardIcon></ArrowDownwardIcon>;
    } else {
      icon = <span>{this.props.text}</span>;
    }
    return (
      <Fab color="secondary" sx={{ boxShadow: 3 }} aria-label={this.props.text} onClick={this.handleChange}>
        {icon}
      </Fab>
    );
  }
}

export default ElevatorButton;
