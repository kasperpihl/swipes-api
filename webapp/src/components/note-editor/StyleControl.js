import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import { Map } from 'immutable'
import './styles/style-control.scss'

class StyleControl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      styles: Map()
    }
  }
  getCenterFromX(x, w) {

    return x - (w / 2);
  }
  handleDefaultPosition(styles) {
    const { editorState, position } = this.props;
    const { styleControls } = this.refs;
    const selection = editorState.getSelection();
    const w = styleControls.clientWidth;
    const h = styleControls.clientHeight;

    styles = styles.set('left', (position.left + (position.width / 2)) - (w / 2));

    if (selection.get('isBackward')) {
      styles = styles.set('top', position.top - (h + 20) );
    } else {
      styles = styles.set('top', position.bottom + 20);
    }

    return styles;
  }
  handleMousePosition(styles) {
    const { editorState, position, mouseUp } = this.props;
    const { styleControls } = this.refs;
    const selection = editorState.getSelection();
    const w = styleControls.clientWidth;
    const h = styleControls.clientHeight;

    if (mouseUp.mousePos) {

      if (selection.get('isBackward')) {
        styles = styles.set('left', this.getCenterFromX(mouseUp.mousePos.x, w));
        styles = styles.set('top', mouseUp.mousePos.y - h - 20);
      } else {
        styles = styles.set('left', this.getCenterFromX(mouseUp.mousePos.x, w));
        styles = styles.set('top', mouseUp.mousePos.y + 20);
      }
    }

    return styles;
  }
  handleScreenBounderies(styles) {
    const { styleControls } = this.refs;
    const w = styleControls.clientWidth;
    const h = styleControls.clientHeight;
    const ww = window.innerWidth;
    const wh = window.innerHeight;

    if (styles.get('left') < 10) {
      styles = styles.set('left', 10);
    }
    else if (styles.get('top') < 64) {
      styles = styles.set('top', 64);
    }
    else if ((styles.get('left') + w) > ww - 10) {
      styles = styles.set('left', ww - 10);
    }
    else if ((styles.get('top') + h) > wh - 10) {
      styles = styles.set('top', wh - 10);
    }

    return styles;
  }
  handleContentOverlap(styles) {
    const { editorState, position } = this.props;
    const selection = editorState.getSelection();
    const { styleControls } = this.refs;
    const w = styleControls.clientWidth;
    const h = styleControls.clientHeight;
    const ww = window.innerWidth;
    const wh = window.innerHeight;

    if ((styles.get('top') + h) > position.top && (styles.get('top') + h) < position.bottom) {
      styles = styles.set('top', position.bottom + 20);
    }
    else if ((styles.get('top') + h) > wh) {
      styles = styles.set('top', position.top - (h + 20) );
    }

    return styles;
  }
  calculatePosition(){
    const { styles } = this.state;
    let newStyles = styles;

    newStyles = this.handleDefaultPosition(newStyles);
    newStyles = this.handleMousePosition(newStyles);
    newStyles = this.handleScreenBounderies(newStyles);
    newStyles = this.handleContentOverlap(newStyles);

    if (styles !== newStyles) {
      this.setState({styles: newStyles});
    }
  }
  calculatePosition1() {
    const { editorState, position, mouseUp } = this.props;
    const selection = editorState.getSelection();
    let style = {};

    if (!mouseUp.mousePos) {
      style.left = position.left + (position.width / 2);
      style.top = position.bottom;
      style.transform = 'translateY(20%) translateX(-50%)'

      if (selection.get('isBackward')) {
        style.top = position.top;
        style.transform = 'translateY(-120%) translateX(-50%)'
      }
    } else {
      style.left = mouseUp.mousePos.x + 20;
      style.top = mouseUp.mousePos.y + 20;

      if (selection.get('isBackward')) {
        style.left = mouseUp.mousePos.x;
        style.top = mouseUp.mousePos.y;
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
    const { styles } = this.state;

    return (
      <div className="RichEditor-controls" ref="styleControls" style={styles.toJS()}>
        {this.renderButtons()}
      </div>
    )
  }
}

export default StyleControl

const { string } = PropTypes;

StyleControl.propTypes = {
}
