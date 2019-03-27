import React from 'react';
import SW from './InputToggle.swiss';

export default function InputToggle({ value, onChange }) {
  const handleClick = e => {
    e.preventDefault();
    onChange(!value);
  };

  return (
    <SW.PackageWrapper>
      <SW.Switch onClick={handleClick} checked={value}>
        <SW.Slider checked={value} />
      </SW.Switch>
    </SW.PackageWrapper>
  );
}
