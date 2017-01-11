import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';

import './styles/button.scss';

class Button extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
    const { onClick, disabled } = this.props;
    if (onClick && !disabled) {
      onClick(e);
    }
  }
  renderIcon() {
    const { icon } = this.props;

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
    const {
      primary,
      icon,
      text,
      disabled,
      small,
      alignIcon,
      frameless,
      className: classNameFromButton,
      ...rest
    } = this.props;
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

    if (frameless) {
      className += ' g-button--frameless';
    }

    if (disabled) {
      className += ' g-button--disabled';
    }

    if (classNameFromButton && typeof classNameFromButton === 'string') {
      className += ` ${classNameFromButton}`;
    }

    return (
      <div className={className} {...rest} onClick={this.onClick}>
        {this.renderIcon()}
        {this.renderText()}
      </div>
    );
  }
}

export default Button;

const { string, bool, func } = PropTypes;

Button.propTypes = {
  onClick: func,
  className: string,
  primary: bool,
  icon: string,
  text: string,
  small: bool,
  alignIcon: string,
};
