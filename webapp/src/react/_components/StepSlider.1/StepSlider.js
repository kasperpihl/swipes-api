import React, { Component } from 'react';
import Button from '_shared/Button/Button';
import SW from './StepSlider.swiss';

export default class stepSlider extends Component {
  render() {
    const { sliderValue, handleChange } = this.props;
    // const sliderBackground = (sliderValue / max) * 100;
    console.log(sliderValue);
    return (
      <SW.InputPackage>
        <Button icon="Minus" onClick={e => handleChange(sliderValue - 1)} />
        <SW.StepCounter>{sliderValue}</SW.StepCounter>
        <Button icon="Plus" onClick={e => handleChange(sliderValue + 1)} />
        {/* <SW.Input
          type="range"
          onChange={onSliderChange}
          min={min}
          max={max}
          value={sliderValue}
          colorValue={sliderBackground}
        /> */}
      </SW.InputPackage>
    );
  }
}
