import React from 'react';
import * as Icons from './icons';

export default function Icon(props) {
  const {
    svg,
    png,
    src,
    ...other
  } = props;
  let returnHtml = null;

  if (svg) {
    const Comp = Icons[svg];

    returnHtml = <Comp {...other} />;
  }

  if (png || src) {
    let iSrc = Icons[png];
    if (!iSrc) {
      iSrc = src || png;
    }
    returnHtml = <img src={iSrc} {...other} role="presentation" />;
  }

  return returnHtml;
}

const { string } = React.PropTypes;

Icon.propTypes = {
  icon: string,
};
