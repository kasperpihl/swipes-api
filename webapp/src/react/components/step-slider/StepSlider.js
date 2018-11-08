import React, { Component } from 'react';
import SW from './StepSlider.swiss';

export default class stepSlider extends Component {
  render() {
    const { 
       sliderValue, onSliderChange, min, max
    } = this.props;
    return (
      <SW.InputPackage>
        <SW.InputButton></SW.InputButton>
        <SW.Input
          type="range"
          onChange={onSliderChange}
          min={min}
          max={max}
          value={sliderValue}
        />
        <SW.InputButton right></SW.InputButton>
      </SW.InputPackage>
    )
  }
}