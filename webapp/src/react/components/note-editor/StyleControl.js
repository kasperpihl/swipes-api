import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { map } from 'react-immutable-proptypes';
import { bindAll } from 'classes/utils';
import Icon from 'Icon';

import './styles/style-control.scss';

class StyleControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: Map(),
      showInput: false,
    };
    bindAll(this, ['addLink', 'handleKeyUp']);
  }
  componentDidMount() {
    setTimeout(() => {
      this.calculatePosition();
    }, 0);
  }
  onToggle(style, type) {
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
    let newStyles;

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
    let newStyles;

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
    let newStyles;

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
  callDelegate(name, ...arg) {
    const { delegate } = this.props;

    if (delegate && typeof delegate[name] === 'function') {
      return delegate[name](...[this].concat(Array.prototype.slice.call(arg, 1)));
    }

    return undefined;
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
        { label: 'OL', style: 'ordered-list-item' },
        { label: 'UnorderedListIcon', style: 'unordered-list-item' },
        { label: 'C', style: 'code-block' },
      ],
      inline: [
        { label: 'BoldIcon', style: 'BOLD' },
        { label: 'ItallicIcon', style: 'ITALIC' },
        { label: 'UnderlineIcon', style: 'UNDERLINE' },
      ],
      entities: [
        { label: 'url', style: 'link' },
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
      <Button
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
            {this.renderIcon('ArrowRightIcon')}
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

const Button = (props) => {
  const { label, style, type, blockType, currentStyle } = props.data;
  let className = 'RichEditor-styleButton';
  let RenderIcon;

  if (style === blockType || currentStyle.has(style)) {
    className += ' RichEditor-activeButton';
  }

  if (<Icon svg={label} />) {
    RenderIcon = <Icon svg={label} className="RichEditor__icon" />;
  } else {
    RenderIcon = <span>{label}</span>;
  }

  return (
    <span className={className} onMouseDown={props.callback(style, type)}>
      {RenderIcon}
    </span>
  );
};

export default StyleControl;

const { object, func } = PropTypes;

StyleControl.propTypes = {
  editorState: map,
  position: object,
  mouseUp: object,
  delegate: object,
};

Button.propTypes = {
  data: object,
  callback: func,
};
