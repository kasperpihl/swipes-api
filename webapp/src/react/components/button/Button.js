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
    const { primary, icon, text, small, alignIcon } = this.props;
    let className = 'g-button';

    if ((alignIcon === 'right') && icon && text) {
      className += ' g-button--reverse';
    }

    if (small) {
      className += ' g-button--small';
    }

    if (primary) {
      className += ' g-button--primary';
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

const { string, bool } = PropTypes;

Button.propTypes = {
  primary: bool,
  icon: string,
  text: string,
  small: bool,
  alignIcon: string,
};
