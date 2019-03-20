import React from 'react';
import PropTypes from 'prop-types';
import SW from './InputText.swiss';

export default function InputText({
  type,
  placeholder,
  onChange,
  onKeyDown,
  value,
  ...rest
}) {
  return (
    <SW.Input
      type={type}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
}

InputText.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func
};
