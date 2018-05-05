import React, { PureComponent } from 'react';
import Icon from 'Icon';
import RotateLoader from 'components/loaders/RotateLoader';
import './styles/button.scss';

const MIN_TIME = 1000;
const SUCCESS_TIMER = 3000;

class Button extends PureComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
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

    return <Icon icon={icon} className="g-button__svg" />;
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
  renderResultState() {
    const { success, error } = this.props;
    let label = '';
    let icon = '';

    if (!success && !error) {
      return undefined;
    }

    label = success || error;
    icon = success ? 'CircleCheckmark' : 'Close';

    return (
      <div className="g-button__result-state">
        <Icon icon={icon} className="g-button__svg" />
        <div className="g-button__text">{label}</div>
      </div>
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
      selected,
      tabIndex: tabIndexProps,
      className: classNameFromButton,
      loading,
      error,
      success,
      ...rest
    } = this.props;

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

    if (error) {
      className += ' g-button--result g-button--error';
    }

    if (success) {
      className += ' g-button--result g-button--success';
    }

    if (selected) {
      className += ' g-button--selected';
    }

    if (classNameFromButton && typeof classNameFromButton === 'string') {
      className += ` ${classNameFromButton}`;
    }

    const loaderSize = small ? 28 : 34;

    return (
      <a
        ref="button"
        className={className}
        {...tabIndex}
        {...rest}
        onClick={this.onClick}
      >
        {this.renderIcon()}
        {this.renderText()}
        {this.renderResultState()}
        <div className="g-button__loader">
          <RotateLoader size={loaderSize} />
        </div>
      </a>
    );
  }
}

export default Button;
