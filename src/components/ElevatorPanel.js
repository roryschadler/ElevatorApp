import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';

import ElevatorButton from './ElevatorButton';

const MAXPANELHEIGHT = 4;

class ElevatorPanel extends React.Component {
  constructor(props) {
    super(props);
    this.splitColumns = this.splitColumns.bind(this);
  }
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    noText: PropTypes.bool,
    text: PropTypes.string,
    reverse: PropTypes.bool
  };

  static defaultProps = {
    noText: false,
    reverse: false
  };

  splitColumns(children) {
    const resultColumns = [];
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; i += MAXPANELHEIGHT) {
        resultColumns.push(children.slice(i, i + MAXPANELHEIGHT));
      }
    } else {
      resultColumns.push(children);
    }
    return resultColumns.map((item, index) => (
      <Grid
        container
        item
        direction={this.props.reverse ? 'column-reverse' : 'column'}
        spacing={1}
        xs={Math.floor(12 / resultColumns.length)}
        key={`col${index}`}
      >
        {item}
      </Grid>
    ));
  }

  render() {
    const textItem = !this.props.noText ? (
      <Grid item xs={12}>{this.props.text}</Grid>
    ) : null;

    const buttonColumns = this.splitColumns(this.props.children);
    let buttons;
    if (buttonColumns.length > 1) {
      buttons = (
        <Grid container item xs={12} spacing={2}>
          {buttonColumns}
        </Grid>
      );
    } else {
      buttons = buttonColumns[0];
    }

    return (
      <Grid container alignItems='center'>
        {textItem}
        {buttons}
      </Grid>
    );
  }
}

class FloorPanel extends React.Component {
  static propTypes = {
    floor: PropTypes.string.isRequired,
    location: PropTypes.string,
    noText: PropTypes.bool,
  };

  static defaultProps = {
    noText: false,
  };

  render() {
    const panelProps = {
      noText: this.props.noText,
      text: `Floor ${this.props.floor}`,
    };
    const upButton = (
      <ElevatorButton
        text='up'
        onClick={buttonClick('up', this.props.floor)}
        key='up'
      />
    );
    const downButton = (
      <ElevatorButton
        text='down'
        onClick={buttonClick('down', this.props.floor)}
        key='down'
      />
    );
    if (this.props.location) {
      if (this.props.location === 'top') {
        return <ElevatorPanel {...panelProps}>{downButton}</ElevatorPanel>;
      } else if (this.props.location === 'bottom') {
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
}

class CarPanel extends React.Component {
  constructor(props) {
    super(props);
    this.floorCount = parseInt(this.props.floors) || 0;
  }
  static propTypes = {
    floors: PropTypes.string.isRequired,
  };

  render() {
    const buttonList = Array.from({ length: this.floorCount }, (x, i) =>
      i.toString()
    ).map((i) => <ElevatorButton text={i} onClick={buttonClick(i)} key={i} />);
    return <ElevatorPanel text='Elevator Car' reverse>{buttonList}</ElevatorPanel>;
  }
}

function buttonClick(buttonText, floorString) {
  return () =>
    console.log(`${floorString ? floorString + ',' : ''}${buttonText}`);
}

export default ElevatorPanel;
export { CarPanel, FloorPanel };
