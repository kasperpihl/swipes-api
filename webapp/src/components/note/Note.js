import React, { Component, PropTypes } from 'react'
import {Editor, EditorState, RichUtils, ContentBlock, getVisibleSelectionRect} from 'draft-js'

import './styles/note.scss'

class Note extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty() // Initiate Editor
    }

    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = this.handleKeyCommand.bind(this); // For keyboard shortcuts
    this.toggleBlockType = (type) => this._toggleBlockType(type); // toggling blocktype
  }
  componentDidMount() {
  }
  handleKeyCommand(keyCommand) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, keyCommand);

    if (newState) {
      this.onChange(newState)
      return 'handled'
    }

    return 'not handled'
  }
  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }
  renderBlockStyleControls() {
    const { editorState } = this.state;
    const selectionState = editorState.getSelection();

    if (selectionState.anchorOffset === selectionState.focusOffset) {
      return;
    }

    const selectionRect = getVisibleSelectionRect(window);

    return (
      <BlockStyleControls
        editorState={editorState}
        onToggle={this.toggleBlockType}
        backwards={selectionState.isBackward}
        position={selectionRect}
      />
    )
  }
  render() {
    const { editorState } = this.state;

    return (
      <div className="sw-text-editor">
        {this.renderBlockStyleControls()}
        <Editor
          editorState={editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
          blockStyleFn={this.handleBlock}
        />
      </div>
    )
  }
}

const BlockStyleControls = (props) => {
  const { editorState, position, backwards } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'}
  ];

  console.log(position);

  // let style = {
  //   top: position.top,
  //   transform: 'translateY(-120%) translateX(-50%)'
  // }

  let style = {
    left: position.left,
    top: position.top,
    transform: 'translateY(-120%) translateX(-50%)'
  };

  return (
    <div className="RichEditor-controls" style={style}>
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';

    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

export default Note

const { string } = PropTypes;

Note.propTypes = {

}
