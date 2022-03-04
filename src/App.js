import './App.css';
import React from 'react';
import { ThemeProvider } from '@mui/system';
import { Tabs, Tab, Grid } from '@mui/material';

import theme from './theme';
import ElevatorDisplay from './components/ElevatorDisplay';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      floors: ['1', '2', '3', '4', '5', '6'],
      tabValue: 'all',
    };
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange = (e, newTabValue) => {
    this.setState({ tabValue: newTabValue });
  };

  render() {
    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <Grid container spacing={1}>
            <Grid item xs={12} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={this.state.tabValue}
                onChange={this.handleTabChange}
                aria-label="elevator tabs"
                variant="scrollable"
              >
                <Tab label="Control Panel" value="all"></Tab>
                <Tab label="Elevator Car" value="car"></Tab>
                {this.state.floors.map((floor) => (
                  <Tab label={`Floor ${floor}`} value={floor} key={floor}></Tab>
                ))}
              </Tabs>
            </Grid>
            <Grid item xs={12}>
              <ElevatorDisplay
                value={this.state.tabValue}
                floors={this.state.floors}
              />
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
