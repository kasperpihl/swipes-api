import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'

import './styles/style-control.scss'

class StyleControl extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  onToggle(e, style) {
    const { onToggleBlock, onToggleInline } = this.props;
    e.preventDefault;

    if (onToggleBlock) {
      onToggleBlock(style);
    }

    if (onToggleInline) {
      onToggleInline(style)
    }
  }
  renderIcon(icon){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="RichEditor-styleButton__icon"/>;
    }
  }
  renderButtons() {
    const styleOptions = {
      block: [
        {label: 'H1Icon', style: 'header-one'},
        {label: 'H2Icon', style: 'header-two'},
        {label: 'UnorderedListIcon', style: 'unordered-list-item'}
      ],
      inline: [
        {label: 'BoldIcon', style: 'BOLD'},
        {label: 'ItallicIcon', style: 'ITALIC'},
        {label: 'UnderlineIcon', style: 'UNDERLINE'}
      ]
    }

    const blockHtml = styleOptions.block.map( (option) => {
      return this.renderButton(option.label, option.style)
    })

    const inlineHtml = styleOptions.inline.map( (option) => {
      return this.renderButton(option.label, option.style)
    })


    return (
      <div className="buttons">
        {blockHtml}
        {inlineHtml}
      </div>
    )
  }
  renderButton(label, style) {
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    const currentStyle = editorState.getCurrentInlineStyle();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    let className = 'RichEditor-styleButton';

    if (style === blockType || currentStyle.has(style)) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} key={label} onMouseDown={this.onToggle.bind(this, style)}>
        {this.renderIcon(label)}
      </span>
    )
  }
  render() {
    const { editorState, position, mousePosition } = this.props;
    const selection = editorState.getSelection();
    let style = {};

    if (!mousePosition.mousePos) {
      style.left = position.left + (position.width / 2);
      style.top = position.bottom;
      style.transform = 'translateY(20%) translateX(-50%)'

      if (selection.get('isBackward')) {
        style.top = position.top;
        style.transform = 'translateY(-120%) translateX(-50%)'
      }
    } else {
      style.left = mousePosition.mousePos.x + 20;
      style.top = mousePosition.mousePos.y + 20;

      if (selection.get('isBackward')) {
        style.left = mousePosition.mousePos.x;
        style.top = mousePosition.mousePos.y;
        style.transform = 'translateY(-120%) translateX(-120%)'
      }
    }

    return (
      <div className="RichEditor-controls" style={style}>
        {this.renderButtons()}
      </div>
    )
  }
}

export default StyleControl

const { string } = PropTypes;

StyleControl.propTypes = {
}
