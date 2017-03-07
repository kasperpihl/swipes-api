import React, { Component, PropTypes } from 'react';
import {
  Editor,
  EditorState,
  getDefaultKeyBinding,
  CompositeDecorator,
} from 'draft-js';

import MultiDecorator from 'draft-js-multidecorators';
import NoteLink from './decorators/link/NoteLink';
import ChecklistBlock from './blocks/checklist/ChecklistBlock';
import DefaultBlocks from './blocks/default/DefaultBlocks';
import CodeBlock from './blocks/code/CodeBlock';
import MediumEditor from './medium-editor/MediumEditor';
import DraftExt from './draft-ext';

import './styles/note-editor.scss';

class NoteEditor extends Component {
  static decorator(DecoratorComponent) {
    return {
      strategy: DecoratorComponent.strategy,
      component: DecoratorComponent,
    };
  }
  static getEmptyEditorState() {
    const decorators = new MultiDecorator([
      CodeBlock.getDecorator(),
      new CompositeDecorator([
        NoteLink,
      ].map(d => this.decorator(d))),
    ]);

    return EditorState.createEmpty(decorators);
  }
  constructor(props) {
    super(props);

    this.setEditorState = props.onChange;

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
  }
  onChange(editorState) {
    this.setEditorState(editorState);
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
  onChange: func,
  onBlur: func,
  editorState: object,
  readOnly: bool,
};
