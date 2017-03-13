import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';

class ControlButton extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
    const {
      data,
      callback,
    } = this.props;
    const {
      style,
      type,
    } = data;
    e.preventDefault();
    callback(style, type);
  }
  render() {
    const { label, style, blockType, currentStyle } = this.props.data;
    let className = 'RichEditor-styleButton';
    let RenderIcon;

    if (style === blockType || currentStyle.has(style)) {
      className += ' RichEditor-activeButton';
    }

    if (<Icon icon={label} />) {
      RenderIcon = <Icon icon={label} className="RichEditor-controls__icon" />;
    } else {
      RenderIcon = <span>{label}</span>;
    }

    return (
      <span className={className} onClick={this.onClick}>
        {RenderIcon}
      </span>
    );
  }
}

export default ControlButton;

const { object, func } = PropTypes;

ControlButton.propTypes = {
  data: object,
  callback: func,
};
