import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import ElevatorButton from './ElevatorButton';

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
    reverse: PropTypes.bool,
  };

  static defaultProps = {
    noText: false,
    reverse: false,
  };

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
          alignItems='center'
          justifyContent='center'
        >
          {item}
        </Stack>
      </Grid>
    ));
  }

  render() {
    const textItem = !this.props.noText ? (
      <Grid item sx={{ textAlign: 'center' }}>
        {this.props.text}
      </Grid>
    ) : null;

    return (
      <Grid container spacing={1} direction='column'>
        {textItem}
        <Grid
          container
          item
          spacing={1}
          alignItems='center'
          justifyContent='center'
        >
          {this.splitColumns(this.props.children)}
        </Grid>
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
    floors: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  render() {
    const buttonList = this.props.floors.map((floor) => (
      <ElevatorButton text={floor} onClick={buttonClick(floor)} key={floor} />
    ));
    return (
      <ElevatorPanel text='Elevator Car' reverse>
        {buttonList}
      </ElevatorPanel>
    );
  }
}

function buttonClick(buttonText, floorString) {
  return () =>
    console.log(`${floorString ? floorString + ',' : ''}${buttonText}`);
}

export default ElevatorPanel;
export { CarPanel, FloorPanel };
