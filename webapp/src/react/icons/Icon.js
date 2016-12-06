import React from 'react';
import * as Icons from './icons';

export default function Icon(props) {
  const {
    svg,
    png,
    ...other
  } = props;
  let returnHtml;

  if (svg) {
    const Comp = Icons[svg];

    returnHtml = <Comp {...other} />;
  }

  if (png) {
    const src = Icons[png];
    returnHtml = <img src={src} {...other} role="presentation" />;
  }

  if (Icons[svg] && Icons[png]) {
    returnHtml = undefined;
  }

  return returnHtml;
}

const { string } = React.PropTypes;

Icon.propTypes = {
  icon: string,
};
