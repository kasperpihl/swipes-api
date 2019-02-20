import React, { Component } from 'react';
import ProgressCircle from 'src/react/_components/ProgressCircle/ProgressCircle';
import ProgressBar from 'src/react/_components/ProgressBar/ProgressBar';

export default class Tester extends Component {
  state = {
    progress: 50
  };
  render() {
    return (
      <div>
        <ProgressBar progress={this.state.progress} />
      </div>
    );
  }
}
