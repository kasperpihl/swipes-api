import React, { Component, PropTypes } from 'react';
import {
  Editor,
  EditorState,
  SelectionState,
  RichUtils,
  getVisibleSelectionRect,
  getDefaultKeyBinding,
  CompositeDecorator,
  DefaultDraftBlockRenderMap,
  Modifier,
  Entity,
} from 'draft-js';
import Immutable from 'immutable';
import { bindAll } from 'classes/utils';
import StyleControl from './StyleControl';
import NoteLink from './NoteLink';
import NoteChecklist from './NoteChecklist';

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
        'blockRender',
        'keyBindingFn',
        'updateBlockMetadata',
        'handleBeforeInput',
      ],
    );
    const blockRenderMap = Immutable.Map({
      checklist: {
        element: 'li',
        wrapper: {
          type: 'ul',
          props: {
            className: 'checklist-ul',
          },
        },
      },
    });
    this.blockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

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

      // editor.focus();
      this.onChange(newEditorState);
    }, 0);
  }
  updateBlockMetadata(blockKey, metadata) {
    const { editorState } = this.props;
    let contentState = editorState.getCurrentContent();
    const updatedBlock = contentState
      .getBlockForKey(blockKey)
      .mergeIn(['data'], metadata);

    let blockMap = contentState.getBlockMap();
    blockMap = blockMap.merge({ [blockKey]: updatedBlock });
    contentState = contentState.merge({ blockMap });

    const newEditorState = EditorState.push(editorState, contentState, 'metadata-update');
    this.onChange(newEditorState);
  }
  blockRender(contentBlock) {
    const type = contentBlock.getType();
    switch (type) {
      case 'checklist':
        return {
          component: NoteChecklist,
          props: {
            updateMetadataFn: this.updateBlockMetadata,
            checked: !!contentBlock.getData().get('checked'),
          },
        };
      default:
        return null;
    }
  }
  getDefaultBlockData(blockType, initialData = {}) {
    switch (blockType) {
      case 'checklist':
        return { checked: false };
      default:
        return initialData;
    }
  }
  resetBlockType(editorState, newType = Block.UNSTYLED) {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const key = selectionState.getStartKey();
    const blockMap = contentState.getBlockMap();
    const block = blockMap.get(key);
    let newText = '';

    if (block.getLength() >= 2) {
      newText = '';
    }

    const newBlock = block.merge({
      text: newText,
      type: newType,
      data: this.getDefaultBlockData(newType),
    });
    const newContentState = contentState.merge({
      blockMap: blockMap.set(key, newBlock),
      selectionAfter: selectionState.merge({
        anchorOffset: 0,
        focusOffset: 0,
      }),
    });
    return EditorState.push(editorState, newContentState, 'change-block-type');
  }
  handleBeforeInput(str) {
    if (str !== ' ') {
      return false;
    }

    const { editorState } = this.props;
    const selection = editorState.getSelection();
    const currentBlock = editorState.getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const blockType = currentBlock.getType();
    const blockLength = currentBlock.getLength();

    if (blockLength === 1 && currentBlock.getText() === '-') {
      this.onChange(this.resetBlockType(editorState, 'unordered-list-item'));

      return true;
    } else if (blockLength === 2 && currentBlock.getText() === '1.') {
      this.onChange(this.resetBlockType(editorState, 'ordered-list-item'));

      return true;
    } else if (blockLength === 2 && currentBlock.getText() === '[]') {
      this.onChange(this.resetBlockType(editorState, 'checklist'));

      return true;
    } else if (blockLength === 1 && currentBlock.getText() === '#') {
      this.onChange(this.resetBlockType(editorState, 'header-one'));

      return true;
    } else if (blockLength === 2 && currentBlock.getText() === '##') {
      this.onChange(this.resetBlockType(editorState, 'header-two'));

      return true;
    }

    return false;
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
  keyBindingFn(e) {
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const blockText = editorState.getCurrentContent().getBlockForKey(startKey).getText();
    const blockType = editorState.getCurrentContent().getBlockForKey(startKey).getType();

    if (e.keyCode === 13 && !blockText.length && blockType !== 'unstyled') {
      this.onChange(this.resetBlockType(editorState, 'unstyled'));

      return undefined;
    }

    return NoteChecklist.keyBindingFn(editorState, e)
      || getDefaultKeyBinding(e);
  }
  handleKeyCommand(keyCommand) {
    const { editorState } = this.props;
    let newState = NoteChecklist.handleKeyCommand(editorState, keyCommand);
    if (!newState) {
      newState = RichUtils.handleKeyCommand(editorState, keyCommand);
    }

    if (newState) {
      this.onChange(newState);
      return true;
    }

    return false;
  }
  addLink(styleControl, urlValue) {
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
    const {
      editorState,
      readOnly,
    } = this.props;

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
          blockRenderMap={this.blockRenderMap}
          readOnly={readOnly}
          editorState={editorState}
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={this.keyBindingFn}
          onChange={this.onChange}
          blockStyleFn={this.handleBlock}
          handleBeforeInput={this.handleBeforeInput}
          onTab={this.onTab}
          onBlur={this.props.onBlur}
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
  onBlur: func,
  editorState: object,
  readOnly: bool,
};
