import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';

class StyleControlButton extends Component {
  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
  }
  onMouseDown() {
    const {
      data,
      callback,
    } = this.props;
    const {
      style,
      type,
    } = data;

    callback(style, type);
  }
  render() {
    const { label, style, blockType, currentStyle } = this.props.data;
    let className = 'RichEditor-styleButton';
    let RenderIcon;

    if (style === blockType || currentStyle.has(style)) {
      className += ' RichEditor-activeButton';
    }

    if (<Icon svg={label} />) {
      RenderIcon = <Icon svg={label} className="RichEditor-controls__icon" />;
    } else {
      RenderIcon = <span>{label}</span>;
    }

    return (
      <span className={className} onMouseDown={this.onMouseDown}>
        {RenderIcon}
      </span>
    );
  }
}

export default StyleControlButton;

const { object, func } = PropTypes;

StyleControlButton.propTypes = {
  data: object,
  callback: func,
};
