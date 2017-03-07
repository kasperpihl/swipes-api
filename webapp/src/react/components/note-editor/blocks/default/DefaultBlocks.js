import {
  RichUtils,
} from 'draft-js';
import {
  resetBlockToType,
  createNewEmptyBlock,
} from '../../draft-utils';

class DefaultBlocks {
  static handleKeyCommand(keyCommand) {
    const editorState = ctx.getEditorState();
    const newState = RichUtils.handleKeyCommand(editorState, keyCommand);
    if (newState) {
      ctx.setEditorState(newState);
      return true;
    }

    return false;
  }
  static keyBindingFn(ctx, e) {
    const editorState = ctx.getEditorState();
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const block = editorState.getCurrentContent().getBlockForKey(startKey);
    const blockText = block.getText();
    const blockType = block.getType();
    const isHeaderBlock = ['header-one', 'header-two'].indexOf(blockType) !== -1;

    if (isHeaderBlock && e.keyCode === 13 && block.getLength() > 0 &&
        (block.getLength() === selection.getStartOffset())) {
      ctx.setEditorState(createNewEmptyBlock(editorState, startKey, 'unstyled'));
      return true;
    }

    if (blockType !== 'unstyled' && e.keyCode === 13 && !blockText.length) {
      ctx.setEditorState(resetBlockToType(editorState, 'unstyled'));
      return true;
    }
    return false;
  }
  static onTab(ctx, e) {
    const editorState = ctx.getEditorState();
    const maxDepth = 4;

    e.preventDefault();

    ctx.setEditorState(RichUtils.onTab(e, editorState, maxDepth));
  }
  static handleBeforeInput(ctx, str) {
    const editorState = ctx.getEditorState();
    if (str !== ' ') {
      return false;
    }

    const selection = editorState.getSelection();
    const currentBlock = editorState.getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const blockType = currentBlock.getType();
    const blockLength = currentBlock.getLength();
    if (blockType === 'unstyled') {
      if (blockLength === 1 && currentBlock.getText() === '-') {
        ctx.setEditorState(resetBlockToType(editorState, 'unordered-list-item'));

        return true;
      } else if (blockLength === 2 && currentBlock.getText() === '1.') {
        ctx.setEditorState(resetBlockToType(editorState, 'ordered-list-item'));

        return true;
      } else if (blockLength === 1 && currentBlock.getText() === '#') {
        ctx.setEditorState(resetBlockToType(editorState, 'header-one'));
        return true;
      } else if (blockLength === 2 && currentBlock.getText() === '##') {
        ctx.setEditorState(resetBlockToType(editorState, 'header-two'));
        return true;
      }
    }

    return false;
  }
}

export default DefaultBlocks;
