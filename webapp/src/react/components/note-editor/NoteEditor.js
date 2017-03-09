import React, { Component, PropTypes } from 'react';
import {
  Editor,
  getDefaultKeyBinding,
  convertFromRaw,
} from 'draft-js';
import { setupDelegate } from 'classes/utils';

import NoteLink from './decorators/link/NoteLink';
import ChecklistBlock from './blocks/checklist/ChecklistBlock';
import DefaultBlocks from './blocks/default/DefaultBlocks';
import CodeBlock from './blocks/code/CodeBlock';
import MediumEditor from './medium-editor/MediumEditor';
import DraftExt from './draft-ext';

import './styles/note-editor.scss';

class NoteEditor extends Component {
  constructor(props) {
    super(props);

    this.plugins = DraftExt(this, {
      decorators: [
        NoteLink,
      ],
      blocks: [
        CodeBlock,
        ChecklistBlock,
        DefaultBlocks,
      ],
    });
    this.setEditorState = this.setEditorState.bind(this);
    this.callDelegate = setupDelegate(props.delegate);
    this.onChange = this.setEditorState;
  }
  componentDidMount() {
    const { editorState, rawState } = this.props;
    if (!editorState && rawState) {
      console.log(rawState);
      this.setEditorState(this.plugins.getEditorStateWithDecorators(convertFromRaw(rawState)));
    }
  }
  componentDidUpdate() {
    const { rawState } = this.props;
    if (rawState) {
      const raw = convertFromRaw(rawState);
      this.refs.editor.blur();
      this.setEditorState(this.plugins.getEditorStateWithDecorators(raw), true);
    }
  }
  onLinkClick(url) {
    this.callDelegate('onLinkClick', url);
  }
  setEditorState(editorState, force) {
    this.props.setEditorState(editorState, force);
  }
  getEditorState() {
    return this.props.editorState;
  }
  keyBindingFn(e) {
    return getDefaultKeyBinding(e);
  }
  focus() {
    this.refs.editor.focus();
  }

  render() {
    const {
      editorState,
      readOnly,
    } = this.props;
    if (!editorState) {
      return <div />;
    }

    const contentState = editorState.getCurrentContent();
    const hasText = contentState.hasText();
    let showPlaceholder = !hasText;
    const firstBlock = contentState.getFirstBlock();
    if (showPlaceholder && firstBlock && firstBlock.getType() !== 'unstyled') {
      showPlaceholder = false;
    }
    return (
      <MediumEditor
        editorState={editorState}
        delegate={this}
      >
        <Editor
          ref="editor"
          readOnly={readOnly}
          editorState={editorState}
          {...this.plugins.bind}
          onBlur={this.props.onBlur}
          placeholder={showPlaceholder ? 'Write something cool in me' : undefined}

        />
      </MediumEditor>
    );
  }
}

export default NoteEditor;

const { bool, func, object } = PropTypes;

NoteEditor.propTypes = {
  setEditorState: func.isRequired,
  onBlur: func,
  rawState: object,
  delegate: object,
  editorState: object,
  readOnly: bool,
};
