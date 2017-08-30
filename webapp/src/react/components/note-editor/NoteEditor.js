import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Editor,
  getDefaultKeyBinding,
  convertFromRaw,
} from 'draft-js';
import { setupDelegate } from 'react-delegate';

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

    setupDelegate(this, 'onLinkClick', 'setEditorState');
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

    this.onChange = this.setEditorState;
  }
  componentDidMount() {
    const { editorState, rawState } = this.props;
    if (!editorState && rawState) {
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
  getEditorState() {
    return this.props.editorState;
  }
  keyBindingFn(e) {
    return getDefaultKeyBinding(e);
  }
  onFocus() {
    this.refs.editor.focus();
  }
  renderEditor() {
    const {
      editorState,
      readOnly,
    } = this.props;

    const contentState = editorState.getCurrentContent();
    const hasText = contentState.hasText();
    let showPlaceholder = !hasText;
    const firstBlock = contentState.getFirstBlock();
    if (showPlaceholder && firstBlock && firstBlock.getType() !== 'unstyled') {
      showPlaceholder = false;
    }
    const placeHolder = (
      <div>
        Write down anything - text, lists or tasks.
      </div>
    );

    return (
      <Editor
        ref="editor"
        spellCheck
        readOnly={readOnly}
        editorState={editorState}
        {...this.plugins.bind}
        onBlur={this.props.onBlur}
        placeholder={showPlaceholder ? placeHolder : undefined}

      />
    )
  }
  render() {
    const {
      editorState,
      mediumEditor,
    } = this.props;
    if (!editorState) {
      return <div ref="editor"/>;
    }


    return mediumEditor ? (
      <MediumEditor
        editorState={editorState}
        delegate={this}
      >
        {this.renderEditor()}
      </MediumEditor>
    ) : this.renderEditor();
  }
}

export default NoteEditor;

const { bool, func, object } = PropTypes;

NoteEditor.propTypes = {
  onBlur: func,
  rawState: object,
  delegate: object,
  editorState: object,
  mediumEditor: bool,
  readOnly: bool,
};
