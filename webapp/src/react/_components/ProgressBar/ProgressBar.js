import React, { PureComponent } from 'react';
import SW from './ProgressBar.swiss';

export default class ProgressBar extends PureComponent {
  render() {
    let barProgress = this.props.progress;
    if (!barProgress) {
      barProgress = 0;
    } else if (barProgress > 100) {
      barProgress = 100;
    }
    return (
      <SW.Wrapper>
        <SW.BackgroundLayer />
        <SW.Bar progress={barProgress} />
      </SW.Wrapper>
    );
  }
}
