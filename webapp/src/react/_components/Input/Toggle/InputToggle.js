import React, { useState } from 'react';
import SW from './InputToggle.swiss';

export default function InputToggle({ component }) {
  const [checked, changeInput] = useState(false);

  const handleClick = e => {
    e.preventDefault();
    changeInput(v => !v);
  };

  return (
    <SW.Wrapper>
      <SW.PackageWrapper>
        <SW.Switch onClick={handleClick} checked={checked}>
          <SW.Input type="checkbox" checked={checked} onChange={handleClick} />
          <SW.Slider checked={checked} />
        </SW.Switch>
      </SW.PackageWrapper>
      {component}
    </SW.Wrapper>
  );
}
