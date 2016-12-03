import React, { Component, PropTypes } from 'react';

import { bindAll, hexToRgb, shadeColor } from '../../classes/utils';
import './styles/sw-button.scss';

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonStyles: {
        backgroundColor: props.backgroundColor || null,
      },
      hoverStyles: {},
    };

    if (props.backgroundColor) {
      const rgb = hexToRgb(props.backgroundColor);
      const hoverHex = shadeColor(props.backgroundColor, -14);
      const hoverRGB = hexToRgb(props.backgroundColor);

      this.state.buttonStyles.boxShadow = `0 1px 20px 3px rgba(${rgb}, 0.4)`;
      this.state.hoverStyles.backgroundColor = hoverHex;
      this.state.hoverStyles.boxShadow = `0 1px 10px 1px rgba(${hoverRGB}, 0.4)`;
    }

    bindAll(this, ['handleClick', 'handleMouseEnter', 'handleMouseLeave']);
  }
  componentDidMount() {
  }
  handleClick() {
    const { callback, disabled } = this.props;

    if (disabled) {
      return;
    }

    callback();
  }
  handleMouseEnter() {
    if (!this.state.hover) {
      this.setState({ hover: true });
    }
  }
  handleMouseLeave() {
    if (this.state.hover) {
      this.setState({ hover: false });
    }
  }
  render() {
    const { title, icon, style, disabled, round } = this.props;
    const { buttonStyles, hover } = this.state;
    let hoverStyles = this.state.hoverStyles;

    hoverStyles = hover ? hoverStyles : null;

    const styles = Object.assign({}, style, buttonStyles, hoverStyles);
    let rootClass = 'sw-button';
    let iconContent = '';

    if (icon) {
      rootClass += ' sw-button--icon';
      iconContent = <i className="material-icons">{icon}</i>;
    }

    if (round) {
      rootClass += ' sw-button--round';
    }

    if (disabled) {
      rootClass += ' sw-button--disabled';
    }

    return (
      <div
        className={rootClass}
        style={styles}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className="sw-button__title">{title}</div>
        <div className="sw-button__icon">{iconContent}</div>
      </div>
    );
  }
}

export default Button;

const { string, object, func, bool } = PropTypes;

Button.propTypes = {
  title: string,
  icon: string,
  style: object,
  disabled: bool,
  backgroundColor: string,
  callback: func.isRequired,
  round: bool,
};
