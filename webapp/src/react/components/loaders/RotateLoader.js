import React from 'react';
import './styles/rotate-loader.scss';

export default (props) => {
  const { size, color, bgColor } = props;

  let sizeStyles = {
    width: size + 'px',
    height: size  + 'px',
  }

  return (
    <div className="rotate-loader" style={sizeStyles}>
      <svg viewBox="0 0 36 36">
        <path d="M18,18V0C8.1,0,0,8.1,0,18H18z" stroke="transparent" />
      </svg>
    </div>
  );
};