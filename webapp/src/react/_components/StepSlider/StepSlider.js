import React, { Component } from 'react';
import SW from './StepSlider.swiss';

export default class stepSlider extends Component {
  render() {
    const { 
       sliderValue, onSliderChange, min, max, increase, decrease
    } = this.props;
    return (
      <SW.InputPackage>
        <SW.InputButton deactivated={sliderValue === min} disabled={sliderValue === min} onClick={decrease}/>
        <SW.Input
          type="range"
          onChange={onSliderChange}
          min={min}
          max={max}
          value={sliderValue}
        />
        <SW.InputButton right deactivated={sliderValue === max} disabled={sliderValue === max} onClick={increase}/>
      </SW.InputPackage>
    )
  }
}