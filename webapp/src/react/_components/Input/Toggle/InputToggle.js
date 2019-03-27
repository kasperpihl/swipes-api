import React, { useState } from 'react';
import SW from './InputToggle.swiss';

export default function InputToggle({ component, value, onChange }) {
  const handleClick = e => {
    e.preventDefault();
    onChange(!value);
  };

  return (
    <SW.Wrapper>
      <SW.PackageWrapper>
        <SW.Switch onClick={handleClick} checked={value}>
          <SW.Input type="checkbox" checked={value} onChange={handleClick} />
          <SW.Slider checked={value} />
        </SW.Switch>
      </SW.PackageWrapper>
      {component}
    </SW.Wrapper>
  );
}
