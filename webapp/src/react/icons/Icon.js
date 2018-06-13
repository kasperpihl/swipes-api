import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { string } from 'valjs';
import * as Icons from './icons';
import * as Images from './images';

class Icon extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      icon,
      ...other
    } = this.props;
    if (Icons[icon]) {
      const Comp = Icons[icon];
      return <Comp {...other} />;
    }
    if (Images[icon] || string.require().format('url').test(icon) === null) {
      return <img src={Images[icon] || icon} {...other} role="presentation" />;
    }
    return (
      <i {...other} className={`material-icons ${this.props.className || ''}`.trim()}>{icon}</i>
    );
  }
}


Icon.propTypes = {
  icon: PropTypes.string,
};

export default Icon;
