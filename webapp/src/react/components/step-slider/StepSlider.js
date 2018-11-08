import React, { Component } from 'react';
import SW from './StepSlider.swiss';

export default class StepSlider extends Component {
  render() {
    const { 
      decreaseSliderValue, increaseSliderValue, sliderValue, onSliderChange, min, max
    } = this.props;
    return (
      <SW.InputPackage>
        <SW.InputButton onClick={decreaseSliderValue}></SW.InputButton>
        <SW.Input
          type="range"
          onChange={onSliderChange}
          min={min}
          max={max}
          value={sliderValue}
        />
        <SW.InputButton right onClick={increaseSliderValue}></SW.InputButton>
      </SW.InputPackage>
    )
  }
}