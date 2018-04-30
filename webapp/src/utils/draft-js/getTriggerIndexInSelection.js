export default (editorState, triggerKey) => {
  const contentState = editorState.getCurrentContent();
  const sel = editorState.getSelection();
  if(sel.get('anchorKey') === sel.get('focusKey') &&
      sel.get('anchorOffset') === sel.get('focusOffset')
      ) {
    const block = contentState.getBlockForKey(sel.get('anchorKey'));
    const textToIndex = block.get('text').substr(0, sel.get('anchorOffset'));
    return textToIndex.lastIndexOf(triggerKey);
  }
  return -1;
  
}