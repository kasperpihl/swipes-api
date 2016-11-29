import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'

import './styles/style-control.scss'

class StyleControl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      styles: {}
    }
  }
  handleMousePosition(styles){

  }
  handleScreenBounderies(styles){

  }
  calculatePosition2(){
    const { styles } = this.state;
    let newStyles = styles;
    newStyles = this.handleMousePosition(newStyles);
    newStyles = this.handleScreenBounderies(newStyles);
    newStyles = this.handleContentOverlap(newStyles);
    if(styles !== newStyles){
      this.setState({styles: newStyles});
    }
  }
  calculatePosition() {
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

    this.setState({styles: style})
  }
  componentDidMount() {
    const { styleControls } = this.refs;
    const { styles } = this.state;

    setTimeout( () => {
      const { left, bottom, top, right } = styleControls.getBoundingClientRect();
      this.calculatePosition()
      if (left < 0) {
        console.log('styles', styles)
      }
    }, 0)
  }
  onToggle(style, type) {
    const { onToggleBlock, onToggleInline } = this.props;

    if (type === 'block') {
      onToggleBlock(style)
    }

    if (type === 'inline') {
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
      return this.renderButton(option.label, option.style, 'block')
    })

    const inlineHtml = styleOptions.inline.map( (option) => {
      return this.renderButton(option.label, option.style, 'inline')
    })


    return (
      <div className="buttons">
        {blockHtml}
        {inlineHtml}
      </div>
    )
  }
  renderButton(label, style, type) {
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
      <span className={className} key={label} onMouseDown={this.onToggle.bind(this, style, type)}>
        {this.renderIcon(label)}
      </span>
    )
  }
  render() {

    return (
      <div className="RichEditor-controls" ref="styleControls">
        {this.renderButtons()}
      </div>
    )
  }
}

export default StyleControl

const { string } = PropTypes;

StyleControl.propTypes = {
}
