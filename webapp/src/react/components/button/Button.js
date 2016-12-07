import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';

import './styles/button.scss';

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderIcon() {
    const { icon } = this.props;
    const className = 'g-button__icon';

    if (!icon) {
      return undefined;
    }

    return <Icon svg={icon} className="g-button__svg" />;
  }
  renderText() {
    const { text } = this.props;

    if (!text) {
      return undefined;
    }

    return (
      <div className="g-button__text">{text}</div>
    );
  }
  render() {
    const { secondary, icon, text } = this.props;
    let className = 'g-button';

    if (secondary) {
      className += ' g-button--secondary';
    }

    if (text && icon) {
      className += ' g-button--icon-and-text';
    }

    return (
      <div className={className}>
        {this.renderIcon()}
        {this.renderText()}
      </div>
    );
  }
}

export default Button;
