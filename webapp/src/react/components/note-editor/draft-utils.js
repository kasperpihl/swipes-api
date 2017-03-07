import {
  ContentBlock,
  EditorState,
  genKey,
} from 'draft-js';

export function resetBlockToType(editorState, newType = 'unstyled', blockData, newText) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const block = blockMap.get(key);
  newText = newText || '';

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

export function createNewEmptyBlock(editorState, blockKey, newType) {
  const content = editorState.getCurrentContent();
  const blockMap = content.getBlockMap();
  const block = blockMap.get(blockKey);
  const blocksBefore = blockMap.toSeq().takeUntil(v => (v === block));
  const blocksAfter = blockMap.toSeq().skipUntil(v => (v === block)).rest();
  const newBlockKey = genKey();
  const newBlock = new ContentBlock({
    key: newBlockKey,
    type: newType,
    text: '',
    characterList: block.getCharacterList().slice(0, 0),
    depth: 0,
  });
  const newBlockMap = blocksBefore.concat(
    [[blockKey, block], [newBlockKey, newBlock]],
    blocksAfter,
  ).toOrderedMap();
  const selection = editorState.getSelection();
  const newContent = content.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: selection.merge({
      anchorKey: newBlockKey,
      anchorOffset: 0,
      focusKey: newBlockKey,
      focusOffset: 0,
      isBackward: false,
    }),
  });

  return EditorState.push(editorState, newContent, 'split-block');
}
