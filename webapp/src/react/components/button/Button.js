import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';
const MIN_TIME = 1000;
import './styles/button.scss';

class Button extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = { loading: props.loading || false };
  }
  componentWillUnmount() {
    clearTimeout(this._timer);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.props.loading) {
      if (nextProps.loading) {
        this._loadTime = new Date().getTime();
        this.setState({ loading: nextProps.loading });
        clearTimeout(this._timer);
      } else {
        const nowTime = new Date().getTime();
        const diff = (nowTime - this._loadTime);
        if (diff < MIN_TIME) {
          this._timer = setTimeout(() => {
            this.setState({ loading: false });
          }, MIN_TIME - diff);
        } else {
          this.setState({ loading: nextProps.loading });
        }
      }
    }
  }
  onClick(e) {
    const { onClick, disabled } = this.props;

    if (onClick && !disabled) {
      onClick(e);
    }

    this.refs.button.blur();
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
      loading: lol,
      className: classNameFromButton,
      ...rest
    } = this.props;
    const { loading } = this.state;
    let className = 'g-button';
    const tabIndex = {};

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
      tabIndex.tabIndex = '-1';
    }

    if (loading) {
      className += ' g-button--loading';
    }

    if (classNameFromButton && typeof classNameFromButton === 'string') {
      className += ` ${classNameFromButton}`;
    }

    return (
      <button ref="button" className={className} {...rest} onClick={this.onClick} {...tabIndex}>
        {this.renderIcon()}
        {this.renderText()}
      </button>
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
  disabled: bool,
  loading: bool,
};
