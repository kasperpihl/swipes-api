import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { map } from 'react-immutable-proptypes';
import { bindAll, setupDelegate } from 'classes/utils';
import Icon from 'Icon';
import StyleControlButton from './StyleControlButton';

import './styles/style-control.scss';

class StyleControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: Map(),
      showInput: false,
    };
    this.callDelegate = setupDelegate(props, this);
    bindAll(this, ['addLink', 'handleKeyUp', 'onToggle']);
  }
  componentDidMount() {
    setTimeout(() => {
      this.calculatePosition();
    }, 0);
  }
  onToggle(style, type) {
    console.log('toggle buggle', style, type);
    if (type === 'block') {
      this.callDelegate('toggleBlockType', style);
    }

    if (type === 'inline') {
      this.callDelegate('toggleInlineStyle', style);
    }

    if (type === 'entity') {
      if (style === 'link') {
        this.setState({ showInput: true });
      }
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

    let newStyles = styles.set('left', (position.left + (position.width / 2)) - (w / 2));

    if (selection.get('isBackward')) {
      newStyles = styles.set('top', position.top - (h + 20));
    } else {
      newStyles = styles.set('top', position.bottom + 20);
    }

    return newStyles;
  }
  handleMousePosition(styles) {
    const { editorState, mouseUp } = this.props;
    const { styleControls } = this.refs;
    const selection = editorState.getSelection();
    const w = styleControls.clientWidth;
    const h = styleControls.clientHeight;
    let newStyles = styles;

    if (mouseUp.mousePos) {
      if (selection.get('isBackward')) {
        newStyles = styles.set('left', this.getCenterFromX(mouseUp.mousePos.x, w));
        newStyles = styles.set('top', mouseUp.mousePos.y - h - 20);
      } else {
        newStyles = styles.set('left', this.getCenterFromX(mouseUp.mousePos.x, w));
        newStyles = styles.set('top', mouseUp.mousePos.y + 20);
      }
    }

    return newStyles;
  }
  handleScreenBounderies(styles) {
    const { styleControls } = this.refs;
    const w = styleControls.clientWidth;
    const h = styleControls.clientHeight;
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    let newStyles = styles;

    if (styles.get('left') < 10) {
      newStyles = styles.set('left', 10);
    } else if (styles.get('top') < 64) {
      newStyles = styles.set('top', 64);
    } else if ((styles.get('left') + w) > ww - 10) {
      newStyles = styles.set('left', ww - 10);
    } else if ((styles.get('top') + h) > wh - 10) {
      newStyles = styles.set('top', wh - 10);
    }

    return newStyles;
  }
  handleContentOverlap(styles) {
    const { position } = this.props;
    const { styleControls } = this.refs;
    const h = styleControls.clientHeight;
    const wh = window.innerHeight;
    let newStyles = styles;

    if ((styles.get('top') + h) > position.top && (styles.get('top') + h) < position.bottom) {
      newStyles = styles.set('top', position.bottom + 20);
    } else if ((styles.get('top') + h) > wh) {
      newStyles = styles.set('top', position.top - (h + 20));
    }

    return newStyles;
  }
  calculatePosition() {
    const { styles } = this.state;
    let newStyles = styles;

    newStyles = this.handleDefaultPosition(newStyles);
    newStyles = this.handleMousePosition(newStyles);
    newStyles = this.handleScreenBounderies(newStyles);
    newStyles = this.handleContentOverlap(newStyles);

    if (styles !== newStyles) {
      this.setState({ styles: newStyles });
    }
  }
  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.addLink();
    }
  }
  addLink() {
    const { input } = this.refs;

    if (input.value.length) {
      this.callDelegate('addLink', input.value);
      this.callDelegate('hideStyleControls');
    }
  }
  renderButtons() {
    const styleOptions = {
      block: [
        { label: 'H1Icon', style: 'header-one' },
        { label: 'H2Icon', style: 'header-two' },
        { label: 'OrderedListIcon', style: 'ordered-list-item' },
        { label: 'UnorderedListIcon', style: 'unordered-list-item' },
      ],
      inline: [
        { label: 'BoldIcon', style: 'BOLD' },
        { label: 'ItallicIcon', style: 'ITALIC' },
        { label: 'UnderlineIcon', style: 'UNDERLINE' },
      ],
      entities: [
        { label: 'LinkIcon', style: 'link' },
      ],
    };

    const blockHtml = styleOptions.block.map(option => this.renderButton(option.label, option.style, 'block'));

    const inlineHtml = styleOptions.inline.map(option => this.renderButton(option.label, option.style, 'inline'));

    const entityHtml = styleOptions.entities.map(option => this.renderButton(option.label, option.style, 'entity'));


    return (
      <div className="buttons">
        {blockHtml}
        {inlineHtml}
        {entityHtml}
      </div>
    );
  }
  renderButton(label, style, type) {
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    const currentStyle = editorState.getCurrentInlineStyle();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return (
      <StyleControlButton
        callback={this.onToggle}
        data={{ label, style, type, blockType, currentStyle }}
        key={label}
      />
    );
  }
  renderInput() {
    const { showInput } = this.state;

    if (showInput) {
      return (
        <div className="RichEditor-controls__input-wrapper">
          <input
            ref="input"
            type="text"
            className="RichEditor-controls__input"
            placeholder="Enter url"
            onKeyUp={this.handleKeyUp}
          />
          <button className="RichEditor-controls__input-submit" onClick={this.addLink}>
            <Icon svg="ArrowRightIcon" />
          </button>
        </div>
      );
    }

    return undefined;
  }
  render() {
    const { styles, showInput } = this.state;
    let className = 'RichEditor-controls';

    if (showInput) {
      className += ' RichEditor-controls--input';
    }

    return (
      <div className={className} ref="styleControls" style={styles.toJS()}>
        {this.renderButtons()}
        {this.renderInput()}
      </div>
    );
  }
}


export default StyleControl;

const { object } = PropTypes;

StyleControl.propTypes = {
  editorState: map,
  position: object,
  mouseUp: object,
  delegate: object,
};
