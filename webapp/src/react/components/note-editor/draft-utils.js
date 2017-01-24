import {
  EditorState,
} from 'draft-js';

export function resetBlockToType(editorState, newType = 'unstyled', blockData) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const block = blockMap.get(key);
  const newText = '';

  const newBlock = block.merge({
    text: newText,
    type: newType,
    data: blockData || {},
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
