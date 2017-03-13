import React from 'react';
import { string } from 'valjs';
import * as Icons from './icons';
import * as Images from './images';

export default function Icon(props) {
  const {
    icon,
    ...other
  } = props;
  if (Icons[icon]) {
    const Comp = Icons[icon];
    return <Comp {...other} />;
  }
  if (Images[icon] || string.require().format('url').test(icon) === null) {
    return <img src={Images[icon] || icon} {...other} role="presentation" />;
  }
  return (
    <div {...other}>
      <i className="material-icons">{icon}</i>
    </div>
  );
}


Icon.propTypes = {
  icon: React.PropTypes.string,
};
