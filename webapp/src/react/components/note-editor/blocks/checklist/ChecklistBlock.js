import React, { Component } from 'react';
import { Map } from 'immutable';
import { EditorBlock, EditorState } from 'draft-js';
import Checkbox from 'components/swipes-ui/Checkbox';
import {
  resetBlockToType,
} from '../../draft-utils';

import './styles/check-list';

export default class ChecklistBlock extends Component {
  static blockRenderMap() {
    return Map({
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
  }
  static blockRendererFn(ctx, contentBlock) {
    const type = contentBlock.getType();
    if (type === 'checklist') {
      return {
        component: this,
        props: {
          ctx,
          checked: !!contentBlock.getData().get('checked'),
        },
      };
    }
    return null;
  }
  static onUpArrow(ctx, e) {
    const editorState = ctx.getEditorState();
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const contentState = editorState.getCurrentContent();
    const blockType = contentState.getBlockForKey(startKey).getType();
    const prevBlock = contentState.getBlockBefore(startKey);

    if (blockType === 'checklist' && selection.isCollapsed() && prevBlock) {
      e.preventDefault();
      const focusOffset = selection.focusOffset;
      const prevKey = prevBlock.getKey();
      const prevLength = prevBlock.getLength();
      const newOffsetlocation = focusOffset > prevLength ? prevLength : focusOffset;
      let selectionChanges = {
        focusKey: prevKey,
        focusOffset: newOffsetlocation,
      };

      if (selection.isCollapsed()) {
        selectionChanges = {
          ...selectionChanges,
          anchorKey: prevKey,
          anchorOffset: newOffsetlocation,
        };
      }

      const nextSelection = selection.merge(selectionChanges);
      const updatedEditorState = EditorState.forceSelection(editorState, nextSelection);

      ctx.setEditorState(EditorState.push(updatedEditorState, contentState, 'move-selection-to-prev-block'));

      return true;
    }

    return true;
  }
  static onDownArrow(ctx, e) {
    const editorState = ctx.getEditorState();
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const contentState = editorState.getCurrentContent();
    const blockType = contentState.getBlockForKey(startKey).getType();
    const nextBlock = contentState.getBlockAfter(startKey);

    if (blockType === 'checklist' && selection.isCollapsed() && nextBlock && nextBlock.getType() === 'checklist') {
      e.preventDefault();

      const focusOffset = selection.focusOffset;
      const nextKey = nextBlock.getKey();
      const nextLength = nextBlock.getLength();
      const newOffsetlocation = focusOffset > nextLength ? nextLength : focusOffset;
      let selectionChanges = {
        focusKey: nextKey,
        focusOffset: newOffsetlocation,
      };

      if (selection.isCollapsed()) {
        selectionChanges = {
          ...selectionChanges,
          anchorKey: nextKey,
          anchorOffset: newOffsetlocation,
        };
      }

      const nextSelection = selection.merge(selectionChanges);
      const updatedEditorState = EditorState.forceSelection(editorState, nextSelection);

      ctx.setEditorState(EditorState.push(updatedEditorState, contentState, 'move-selection-to-next-block'));

      return true;
    }

    return false;
  }
  static keyBindingFn(ctx, e) {
    const editorState = ctx.getEditorState();
    // left key
    if (e.keyCode === 37) {
      const selection = editorState.getSelection();
      const startKey = selection.getStartKey();
      const blockType = editorState.getCurrentContent().getBlockForKey(startKey).getType();

      if (blockType === 'checklist' && selection.getStartOffset() === 0
        && (selection.isCollapsed() || selection.getIsBackward())) {
        return 'move-selection-to-end-of-prev-block';
      }
    }

    return false;
  }
  static handleBeforeInput(ctx, str) {
    const editorState = ctx.getEditorState();

    const selection = editorState.getSelection();
    const currentBlock = editorState.getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const blockType = currentBlock.getType();
    const blockLength = currentBlock.getLength();

    if (str === ' ' && blockType === 'unstyled') {
      if (blockLength === 2 && currentBlock.getText() === '[]') {
        ctx.setEditorState(resetBlockToType(editorState, 'checklist', { checked: false }));
        return true;
      } else if (blockLength === 3 && currentBlock.getText() === '[x]') {
        ctx.setEditorState(resetBlockToType(editorState, 'checklist', { checked: true }));
        return true;
      }
    }

    return false;
  }
  static handleKeyCommand(ctx, keyCommand) {
    const editorState = ctx.getEditorState();

    if (keyCommand === 'move-selection-to-end-of-prev-block') {
      const selection = editorState.getSelection();
      const startKey = selection.getStartKey();
      const contentState = editorState.getCurrentContent();
      const prevBlock = contentState.getBlockBefore(startKey);

      if (!prevBlock) return null;

      const prevKey = prevBlock.getKey();
      const prevLength = prevBlock.getLength();

      let selectionChanges = {
        focusKey: prevKey,
        focusOffset: prevLength,
      };

      if (selection.isCollapsed()) {
        selectionChanges = {
          ...selectionChanges,
          anchorKey: prevKey,
          anchorOffset: prevLength,
        };
      }

      const nextSelection = selection.merge(selectionChanges);
      const updatedEditorState = EditorState.forceSelection(editorState, nextSelection);

      ctx.setEditorState(EditorState.push(updatedEditorState, contentState, 'move-selection-to-end-of-prev-block'));

      return true;
    }

    return false;
  }
  constructor(props) {
    super(props);
    this.toggleChecked = this.toggleChecked.bind(this);
  }
  updateBlockMetadata(ctx, blockKey, metadata) {
    const editorState = ctx.getEditorState();
    let contentState = editorState.getCurrentContent();
    const updatedBlock = contentState
      .getBlockForKey(blockKey)
      .mergeIn(['data'], metadata);

    let blockMap = contentState.getBlockMap();
    blockMap = blockMap.merge({ [blockKey]: updatedBlock });
    contentState = contentState.merge({ blockMap });

    const newEditorState = EditorState.push(editorState, contentState, 'metadata-update');
    ctx.setEditorState(newEditorState);
  }
  toggleChecked() {
    const { blockProps, block } = this.props;
    const { ctx, returnFocusToEditor, checked } = blockProps;
    const newChecked = !checked;

    this.updateBlockMetadata(ctx, block.getKey(), { checked: newChecked });

    // I also stop propagation, return focus to the editor and set some state here, but that's probably specific to my app
  }

  render() {
    const { blockProps } = this.props;
    const { checked } = blockProps;

    let className = 'ChecklistEditorBlock';

    if (checked) {
      className += ' ChecklistEditorBlock--checked';
    }

    return (
      <div className={className}>
        <Checkbox checked={checked} onChange={this.toggleChecked} />
        <div className="ChecklistEditorBlock__text"><EditorBlock {...this.props} /></div>
      </div>
    );
  }
}
