export default (editorState, triggerKey) => {
  const contentState = editorState.getCurrentContent();
  const sel = editorState.getSelection();
  const block = contentState.getBlockForKey(sel.get('anchorKey'));
  const textToIndex = block.get('text').substr(0, sel.get('anchorOffset'));
  const triggerIndex = textToIndex.lastIndexOf(triggerKey);
  return textToIndex.substr(triggerIndex + triggerKey.length);
}