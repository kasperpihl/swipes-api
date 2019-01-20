import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setupDelegate } from 'react-delegate';
import { EditorState, Modifier, RichUtils, SelectionState } from 'draft-js';

import Icon from 'src/react/icons/Icon';
import ControlButton from './ControlButton';

import './styles/control-panel.scss';

class ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInput: false
    };
    setupDelegate(this, 'onFocus');
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.show && this.props.show) {
      this.setState({ showInput: false });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.showInput && !prevState.showInput) {
      this.refs.input.focus();
    }
  }
  onToggle = (style, type) => {
    const { editorState, delegate } = this.props;
    const { setEditorState } = delegate;
    if (type === 'block') {
      setEditorState(RichUtils.toggleBlockType(editorState, style));
      setTimeout(this.onFocus, 5);
    }

    if (type === 'inline') {
      setEditorState(RichUtils.toggleInlineStyle(editorState, style));
      setTimeout(this.onFocus, 5);
    }

    if (type === 'entity') {
      if (style === 'link') {
        this.setState({ showInput: true });
      }
    }
  };

  handleKeyUp = e => {
    if (e.keyCode === 13) {
      this.addLink();
    }
    if (e.keyCode === 27) {
      this.setState({ showInput: false });
      this.onFocus();
    }
  };

  addLink = () => {
    const { input } = this.refs;
    const { editorState, delegate } = this.props;
    const { setEditorState } = delegate;

    if (input.value.length) {
      let contentState = editorState.getCurrentContent();
      contentState = contentState.createEntity('LINK', 'MUTABLE', {
        url: input.value
      });
      const entityKey = contentState.getLastCreatedEntityKey();

      const selection = editorState.getSelection();
      const newContentState = Modifier.applyEntity(
        contentState,
        selection,
        entityKey
      );

      let newEditorState = EditorState.set(editorState, {
        currentContent: newContentState
      });

      newEditorState = RichUtils.toggleLink(
        newEditorState,
        selection,
        entityKey
      );

      // Clear selection!
      const emptySelection = SelectionState.createEmpty(
        selection.getStartKey()
      );
      newEditorState = EditorState.acceptSelection(
        newEditorState,
        emptySelection
      );

      setEditorState(newEditorState);
      this.setState({ showInput: false });
    }
  };
  renderButtons() {
    const styleOptions = {
      block: [
        { label: 'HeaderOne', style: 'header-one' },
        { label: 'HeaderTwo', style: 'header-two' },
        { label: 'OrderedList', style: 'ordered-list-item' },
        { label: 'UnorderedList', style: 'unordered-list-item' },
        { label: 'Checklist', style: 'checklist' }
      ],
      inline: [
        { label: 'Bold', style: 'BOLD' },
        { label: 'Itallic', style: 'ITALIC' },
        { label: 'Underline', style: 'UNDERLINE' }
      ],
      entities: [{ label: 'Hyperlink', style: 'link' }]
    };

    const blockHtml = styleOptions.block.map(option =>
      this.renderButton(option.label, option.style, 'block')
    );

    const inlineHtml = styleOptions.inline.map(option =>
      this.renderButton(option.label, option.style, 'inline')
    );

    const entityHtml = styleOptions.entities.map(option =>
      this.renderButton(option.label, option.style, 'entity')
    );

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
      <ControlButton
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
          <button
            className="RichEditor-controls__input-submit"
            onClick={this.addLink}
          >
            <Icon icon="ArrowRightLine" className="RichEditor-controls__icon" />
          </button>
        </div>
      );
    }

    return undefined;
  }
  render() {
    const { showInput } = this.state;
    const { style, show } = this.props;
    let className = 'RichEditor-controls';

    if (showInput) {
      className += ' RichEditor-controls--input';
    }
    if (show) {
      className += ' RichEditor-controls--show';
    }

    return (
      <div className={className} style={style} ref="control">
        {this.renderButtons()}
        {this.renderInput()}
      </div>
    );
  }
}

export default ControlPanel;

const { object, bool, func } = PropTypes;

ControlPanel.propTypes = {
  editorState: object,
  show: bool,
  style: object,
  setEditorState: func,
  delegate: object
};
