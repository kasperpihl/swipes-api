import React from 'react';
import Button from '_shared/Button/Button';
import SW from './Stepper.swiss';

export default function Stepper({
  value,
  onChange,
  maxValue = 100,
  minValue = 1
}) {
  return (
    <SW.InputPackage>
      <Button
        disabled={value <= minValue}
        icon="Minus"
        onClick={() => onChange(value - 1)}
      />
      <SW.StepCounter>{value}</SW.StepCounter>
      <Button
        icon="Plus"
        disabled={value >= maxValue}
        onClick={() => onChange(value + 1)}
      />
    </SW.InputPackage>
  );
}
