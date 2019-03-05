import React, { Component } from 'react';
import SW from './StepSlider.swiss';

export default class stepSlider extends Component {
  render() {
    const {
      sliderValue,
      onSliderChange,
      min,
      max,
      increase,
      decrease
    } = this.props;
    const sliderBackground = (sliderValue / max) * 100;
    return (
      <SW.InputPackage>
        <SW.StepCounter>{sliderValue + 1}</SW.StepCounter>
        <SW.Input
          type="range"
          onChange={onSliderChange}
          min={min}
          max={max}
          value={sliderValue}
          colorValue={sliderBackground} //TODO: once onChange handler is wired up, remove hard coded value and set it to sliderValue
        />
      </SW.InputPackage>
    );
  }
}
