import React, { Component, PropTypes } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  getVisibleSelectionRect,
  getDefaultKeyBinding,
  CompositeDecorator,
  DefaultDraftBlockRenderMap,
} from 'draft-js';
import Immutable from 'immutable';
import { bindAll } from 'classes/utils';
import StyleControl from './extensions/style-control/StyleControl';
import NoteLink from './NoteLink';
import NoteChecklist from './NoteChecklist';
import DraftExt from './draft-ext';
import DefaultBlocks from './extensions/default-blocks/DefaultBlocks';

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


    bindAll(this, [
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
    ]);

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

    this.plugins = DraftExt([
      NoteChecklist,
      DefaultBlocks,
    ], this, this.onChange);
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
      this.refs.styleControl.hideStyleControls();
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
  positionForStyleControls() {
    const selectionRect = getVisibleSelectionRect(window);
    return selectionRect;
  }
  pluginsGetEditorState() {
    return this.props.editorState;
  }
  keyBindingFn(e) {
    return getDefaultKeyBinding(e);
  }
  handleKeyCommand(keyCommand) {
    const { editorState } = this.props;
    const newState = RichUtils.handleKeyCommand(editorState, keyCommand);
    if (newState) {
      this.onChange(newState);
      return true;
    }

    return false;
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
          blockRendererFn={this.blockRender}
          blockRenderMap={this.blockRenderMap}
          readOnly={readOnly}
          editorState={editorState}
          {...this.plugins}
          onChange={this.onChange}
          onTab={this.onTab}
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
