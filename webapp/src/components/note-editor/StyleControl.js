import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import { Map } from 'immutable'
import { bindAll } from '../../classes/utils'

import './styles/style-control.scss'

class StyleControl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      styles: Map(),
      showInput: false
    }
    bindAll(this, ['addLink', 'handleKeyUp']);
  }
  callDelegate(name){
    const { delegate } = this.props;
    if(delegate && typeof delegate[name] === "function"){
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
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
    if (type === 'block') {
      this.callDelegate('toggleBlockType', style)
    }

    if (type === 'inline') {
      this.callDelegate('toggleInlineStyle', style)
    }

    if (type === 'entity') {
      if (style === 'link') {
        this.setState({showInput: true})
      }
    }
  }
  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.addLink();
    }
  }
  addLink() {
    const { addLink } = this.props;
    const { input } = this.refs;

    if (input.value.length) {
      this.callDelegate('addLink', input.value);
      this.callDelegate('hideStyleControls');
    }
  }
  renderIcon(icon){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="RichEditor-controls__icon"/>;
    }

    return <span>{icon}</span>
  }
  renderButtons() {
    const styleOptions = {
      block: [
        {label: 'H1Icon', style: 'header-one'},
        {label: 'H2Icon', style: 'header-two'},
        {label: 'OL', style: 'ordered-list-item'},
        {label: 'UnorderedListIcon', style: 'unordered-list-item'},
        {label: 'C', style: 'code-block'},
      ],
      inline: [
        {label: 'BoldIcon', style: 'BOLD'},
        {label: 'ItallicIcon', style: 'ITALIC'},
        {label: 'UnderlineIcon', style: 'UNDERLINE'}
      ],
      entities: [
        {label: 'url', style: 'link'}
      ]
    }

    const blockHtml = styleOptions.block.map( (option) => {
      return this.renderButton(option.label, option.style, 'block')
    })

    const inlineHtml = styleOptions.inline.map( (option) => {
      return this.renderButton(option.label, option.style, 'inline')
    })

    const entityHtml = styleOptions.entities.map( (option) => {
      return this.renderButton(option.label, option.style, 'entity')
    })


    return (
      <div className="buttons">
        {blockHtml}
        {inlineHtml}
        {entityHtml}
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
  renderInput() {
    const { showInput } = this.state;

    if (!showInput) {
      return
    }

    return (
      <div className="RichEditor-controls__input-wrapper">
        <input ref="input" type="text" className="RichEditor-controls__input" placeholder="Enter url" onKeyUp={this.handleKeyUp}/>
        <div className="RichEditor-controls__input-submit" onClick={this.addLink}>{this.renderIcon('ArrowRightIcon')}</div>
      </div>
    )
  }
  render() {
    const { styles, showInput } = this.state;
    let className = 'RichEditor-controls';

    if (showInput) {
      className += ' RichEditor-controls--input'
    }

    return (
      <div className={className} ref="styleControls" style={styles.toJS()}>
        {this.renderButtons()}
        {this.renderInput()}
      </div>
    )
  }
}

export default StyleControl

const { string } = PropTypes;

StyleControl.propTypes = {
}
