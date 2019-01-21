import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as Icons from 'src/assets/svgs';

class Icon extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { icon, ...other } = this.props;
    if (Icons[icon]) {
      const Comp = Icons[icon];
      return <Comp {...other} />;
    }
    if (
      !/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.exec(
        icon
      )
    ) {
      return <img src={icon} {...other} role="presentation" />;
    }
    console.warn('Icon not found', icon);
    return null;
  }
}

Icon.propTypes = {
  icon: PropTypes.string
};

export default Icon;
