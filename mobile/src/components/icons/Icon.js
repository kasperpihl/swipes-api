import React from 'react';
import Svg from 'react-native-svg';
import svgs from './svgs';

const Icon = (props) => {
  const {
    icon,
  } = props;

  if (!icon) {
    return null;
  }

  const svg = svgs[icon];

  if (svg) {
    const width = props.width || '24';
    const height = props.height || '24';
    const fill = props.fill || 'transparent';
    const stroke = props.stroke || 'transparent';

    return (
      <Svg viewBox={svg.viewBox} width={width} height={height}>
        {React.cloneElement(svg.svg, {
          fill,
          stroke,
        })}
      </Svg>
    );
  }

  return null;
};

export default Icon;
