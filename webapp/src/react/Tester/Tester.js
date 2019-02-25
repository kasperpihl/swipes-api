import React, { Component } from 'react';
import ProgressCircle from 'src/react/_components/ProgressCircle/ProgressCircle';
import ProgressBar from 'src/react/_components/ProgressBar/ProgressBar';
import DayTracker from 'src/react/_components/DayTracker/DayTracker';

export default class Tester extends Component {
  state = {
    progress: 75
  };
  render() {
    const startDate = '2019-02-19';
    const endDate = '2019-02-28';
    return (
      <div>
        <ProgressCircle progress={this.state.progress} />
        <ProgressBar progress={50} />
        <DayTracker startDate={startDate} endDate={endDate} compact />
      </div>
    );
  }
}
