import React, { Component } from 'react';
import { EditorBlock, EditorState } from 'draft-js';
import Checkbox from 'components/swipes-ui/Checkbox';

export default class ChecklistEditorBlock extends Component {
  static keyBindingFn(editorState, e) {
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
    return null;
  }
  static handleKeyCommand(editorState, keyCommand) {
    if (keyCommand === 'move-selection-to-end-of-prev-block') {
      return this.handleMoveSelectionToEndOfPreviousBlockCommand(editorState);
    }
    return null;
  }
  static handleMoveSelectionToEndOfPreviousBlockCommand(editorState) {
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const contentState = editorState.getCurrentContent();
    const prevBlock = contentState.getBlockBefore(startKey);

    // If there's no previous block, then do nothing
    if (!prevBlock) return null;

    const prevKey = prevBlock.getKey();
    const prevLength = prevBlock.getLength();

    // Move the focus offset to the end of the previous line
    let selectionChanges = {
      focusKey: prevKey,
      focusOffset: prevLength,
    };
    // If the selection is collapsed, keep it collapsed by also moving the anchor
    if (selection.isCollapsed()) {
      selectionChanges = {
        ...selectionChanges,
        anchorKey: prevKey,
        anchorOffset: prevLength,
      };
    }

    const nextSelection = selection.merge(selectionChanges);

    // Update the selection state.
    const updatedEditorState = EditorState.forceSelection(editorState, nextSelection);
    return EditorState.push(updatedEditorState, contentState, 'move-selection-to-end-of-prev-block');
  }
  constructor(props) {
    super(props);
    this.toggleChecked = this.toggleChecked.bind(this);
  }

  toggleChecked() {
    const { blockProps, block } = this.props;
    const { updateMetadataFn, returnFocusToEditor, checked } = blockProps;

    const newChecked = !checked;
    updateMetadataFn(block.getKey(), { checked: newChecked });

    // I also stop propagation, return focus to the editor and set some state here, but that's probably specific to my app
  }

  render() {
    const { offsetKey, blockProps } = this.props;
    const { checked } = blockProps;

    let className = 'ChecklistEditorBlock';
    if (checked) {
      className += ' checked';
    }

    return (
      <div className={className} data-offset-key={offsetKey}>
        <Checkbox checked={checked} onChange={this.toggleChecked} />
        <div className="text"><EditorBlock {...this.props} /></div>
      </div>
    );
  }
}
