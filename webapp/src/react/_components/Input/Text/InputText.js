import React from 'react';
import PropTypes from 'prop-types';
import SW from './InputText.swiss';

export default function InputText({
  type,
  placeholder,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
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
      onFocus={onFocus}
      onBlur={onBlur}
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
