import React, { Component, PropTypes } from 'react';
import {
  Editor,
  EditorState,
  getVisibleSelectionRect,
  getDefaultKeyBinding,
  CompositeDecorator,
} from 'draft-js';
import MultiDecorator from 'draft-js-multidecorators';
import { bindAll } from 'classes/utils';
import StyleControl from './extensions/style-control/StyleControl';
import NoteLink from './decorators/link/NoteLink';
import ChecklistBlock from './blocks/checklist/ChecklistBlock';
import DefaultBlocks from './blocks/default/DefaultBlocks';
import CodeBlock from './blocks/code/CodeBlock';

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

    this.state = {
      hasSelected: false,
      styleControl: { show: false },
    };


    bindAll(this, [
      'onKeyDown',
      'onKeyUp',
      'onMouseMove',
      'onMouseUp',
    ]);

    this.onChange = (editorState) => {
      const { onChange } = this.props;
      const sel = editorState.getSelection();
      const hasSelected = (sel.anchorKey !== sel.focusKey || sel.anchorOffset !== sel.focusOffset);
      let styleControl = this.state.styleControl;

      if (!hasSelected && styleControl.show) {
        styleControl = { show: false };
      }

      if (onChange) {
        onChange(editorState);
      }

      this.setState({ hasSelected, styleControl });
    };
    this.setEditorState = this.onChange;
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
  onKeyDown(e) {
    if (e.keyCode === 16) {
      const { styleControl } = this.state;

      if (styleControl.show) {
        this.shiftKeyTest = true;

        setTimeout(() => {
          if (this.shiftKeyTest) {
            this.setState({ styleControl: { show: false } });
          }
        }, 500);
      }
    }
  }
  onKeyUp(e) {
    if (e.keyCode === 16) {
      this.shiftKeyTest = false;
    }
  }
  onMouseUp(e) {
    const x = e.pageX;
    const y = e.pageY;

    setTimeout(() => {
      this.setStyleControl({ show: true, mousePos: { x, y } });
    }, 1);
  }
  onMouseMove() {
    setTimeout(() => {
      this.setStyleControl({ show: true });
    }, 1);
  }
  setStyleControl(styleControlVal) {
    const { styleControl, hasSelected } = this.state;
    const { editorState } = this.props;
    const selectionState = editorState.getSelection();

    if (!styleControl.show && hasSelected && selectionState.getHasFocus()) {
      this.setState({ styleControl: styleControlVal });
    }
  }
  hideStyleControls() {
    let styleControl = this.state.styleControl;

    styleControl = { show: false };
    this.setState({ styleControl });
  }
  positionForStyleControls() {
    const selectionRect = getVisibleSelectionRect(window);
    return selectionRect;
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

  renderStyleControls() {
    const { hasSelected, styleControl } = this.state;
    const { editorState } = this.props;

    if (!styleControl.show || !hasSelected) {
      return undefined;
    }

    const position = this.positionForStyleControls();

    return (
      <StyleControl
        ref="styleControl"
        delegate={this}
        editorState={editorState}
        onChange={this.onChange}
        position={position}
        mouseUp={styleControl}
      />
    );
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
      <div
        ref="rooty" className="sw-text-editor"
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      >
        {this.renderStyleControls()}
        <Editor
          ref="editor"
          readOnly={readOnly}
          editorState={editorState}
          {...this.plugins.bind}
          onBlur={this.props.onBlur}
          placeholder={showPlaceholder ? 'Write something cool in me' : undefined}

        />
      </div>
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
