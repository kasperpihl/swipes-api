import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import SW from './InputRadio.swiss';

export default function InputRadio({
  onChange,
  onKeyDown,
  value,
  label,
  ...rest
}) {
  return (
    <SW.Wrapper>
      <SW.Input
        type="radio"
        onKeyDown={onKeyDown}
        value={value}
        onChange={onChange}
        {...rest}
      />
      <SW.Label>{label}</SW.Label>
    </SW.Wrapper>
  );
}

InputRadio.propTypes = {
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  label: PropTypes.string
};
