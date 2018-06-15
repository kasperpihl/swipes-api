import {
  Editor,
  EditorState,
  Modifier,
} from 'draft-js';
import getTriggerIndexInSelection from './getTriggerIndexInSelection';

export default (editorState, triggerKey) => {
  let contentState = editorState.getCurrentContent();
  let selection = editorState.getSelection();

  const triggerIndex = getTriggerIndexInSelection(editorState, triggerKey)

  selection = selection.set('anchorOffset', triggerIndex);

  contentState = Modifier.removeRange(
    contentState,
    selection,
    'forward',
  );
  
  editorState = EditorState.set(editorState, { currentContent: contentState });

  selection = selection.set('focusOffset', triggerIndex);

  editorState = EditorState.acceptSelection(editorState, selection);

  return editorState;
}

