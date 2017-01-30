import {
  resetBlockToType,
} from '../../draft-utils';

class DefaultBlocks {
  static keyBindingFn(editorState, onChange, e) {
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const blockText = editorState.getCurrentContent().getBlockForKey(startKey).getText();
    const blockType = editorState.getCurrentContent().getBlockForKey(startKey).getType();

    if (e.keyCode === 13 && !blockText.length && blockType !== 'unstyled') {
      onChange(resetBlockToType(editorState, 'unstyled'));
      return true;
    }
    return false;
  }
  static handleBeforeInput(editorState, onChange, str) {
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
        onChange(resetBlockToType(editorState, 'unordered-list-item'));

        return true;
      } else if (blockLength === 2 && currentBlock.getText() === '1.') {
        onChange(resetBlockToType(editorState, 'ordered-list-item'));

        return true;
      } else if (blockLength === 1 && currentBlock.getText() === '#') {
        onChange(resetBlockToType(editorState, 'header-one'));

        return true;
      } else if (blockLength === 2 && currentBlock.getText() === '##') {
        onChange(resetBlockToType(editorState, 'header-two'));
        console.log('wtf');
        return true;
      }
    }
    return false;
  }
}

export default DefaultBlocks;
