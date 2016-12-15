import React from 'react';
import * as Icons from './icons';

export default function Icon(props) {
  const {
    svg,
    png,
    ...other
  } = props;
  let returnHtml = null;

  if (svg) {
    const Comp = Icons[svg];

    returnHtml = <Comp {...other} />;
  }

  if (png) {
    const src = Icons[png];
    returnHtml = <img src={src} {...other} role="presentation" />;
  }

  return returnHtml;
}

const { string } = React.PropTypes;

Icon.propTypes = {
  icon: string,
};
