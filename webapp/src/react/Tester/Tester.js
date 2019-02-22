import React, { Component } from 'react';
import ProgressCircle from 'src/react/_components/ProgressCircle/ProgressCircle';
import ProgressBar from 'src/react/_components/ProgressBar/ProgressBar';

export default class Tester extends Component {
  state = {
    progress: 75
  };
  render() {
    return (
      <div>
        <ProgressCircle progress={this.state.progress} />
        <ProgressBar progress={50} />
      </div>
    );
  }
}
