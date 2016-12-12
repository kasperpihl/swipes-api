import React, { Component, PropTypes } from 'react';
import {
  Editor,
  EditorState,
  SelectionState,
  RichUtils,
  getVisibleSelectionRect,
  CompositeDecorator,
  Modifier,
  Entity,
} from 'draft-js';
import StyleControl from './StyleControl';
import NoteLink from './NoteLink';
import { bindAll } from 'classes/utils';

import './styles/note-editor.scss';

class NoteEditor extends Component {
  static decorator(DecoratorComponent) {
    return {
      strategy: DecoratorComponent.strategy,
      component: DecoratorComponent,
    };
  }
  static getEmptyEditorState() {
    const decorators = [
      NoteLink,
    ].map(d => this.decorator(d));
    const decorator = new CompositeDecorator(decorators);

    return EditorState.createEmpty(decorator);
  }
  blockRendererFn(contentBlock) {
    const type = contentBlock.getType();
    console.log(type);
  }
  constructor(props) {
    super(props);
    this.state = {
      hasSelected: false,
      styleControl: { show: false },
    };

    bindAll(this,
      [
        'onKeyDown',
        'onKeyUp',
        'onMouseMove',
        'onMouseUp',
        'handleKeyCommand',
        'onTab',
      ],
    );

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
  }
  onTab(e) {
    const { editorState } = this.props;
    const maxDepth = 4;

    e.preventDefault();

    this.onChange(RichUtils.onTab(e, editorState, maxDepth));
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

    setTimeout(() => {
      const { editor } = this.refs;
      const { editorState } = this.props;
      const selectionState = editorState.getSelection();
      let newKey = selectionState.get('focusKey');
      let newOffset = selectionState.get('focusOffset');

      if (selectionState.get('isBackward')) {
        newKey = selectionState.get('anchorKey');
        newOffset = selectionState.get('anchorOffset');
      }

      const newSelState = SelectionState.createEmpty().merge({
        anchorKey: newKey,
        anchorOffset: newOffset,
        focusKey: newKey,
        focusOffset: newOffset,
      });
      const newEditorState = EditorState.forceSelection(editorState, newSelState);

      editor.focus();
      this.onChange(newEditorState);
    }, 0);
  }
  positionForStyleControls() {
    const selectionRect = getVisibleSelectionRect(window);
    return selectionRect;
  }
  toggleBlockType(styleControl, blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.props.editorState,
        blockType,
      ),
    );
  }
  toggleInlineStyle(styleControl, inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.props.editorState,
        inlineStyle,
      ),
    );
  }
  handleKeyCommand(keyCommand) {
    const { editorState } = this.props;
    const newState = RichUtils.handleKeyCommand(editorState, keyCommand);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }

    return 'not handled';
  }
  addLink(styleControl, urlValue) {
    console.log('get here?');
    const { editorState } = this.props;
    const entityKey = Entity.create(
      'LINK',
      'MUTABLE',
      { url: urlValue },
    );
    const contentState = editorState.getCurrentContent();
    const newContentState = Modifier.applyEntity(
      contentState,
      editorState.getSelection(),
      entityKey,
    );
    let newEditorState = EditorState.set(editorState, { currentContent: newContentState });

    newEditorState = RichUtils.toggleLink(
      newEditorState,
      newEditorState.getSelection(),
      entityKey,
    );
    console.log('newEditorState.toJS()', newEditorState.toJS());
    this.props.onChange(newEditorState);
  }
  removeLink() {
    const { editorState } = this.props;
    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      this.props.onChange(RichUtils.toggleLink(editorState, selection, null));
    }
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
        delegate={this}
        editorState={editorState}
        position={position}
        mouseUp={styleControl}
      />
    );
  }
  render() {
    const { editorState, readOnly } = this.props;

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
          blockRendererFn={this.blockRender}
          readOnly={readOnly}
          editorState={editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
          blockStyleFn={this.handleBlock}
          onTab={this.onTab}
          placeholder="Write something cool in me"
        />
      </div>
    );
  }
}

export default NoteEditor;

const { bool, func, object } = PropTypes;

NoteEditor.propTypes = {
  onChange: func,
  editorState: object,
  readOnly: bool,
};
