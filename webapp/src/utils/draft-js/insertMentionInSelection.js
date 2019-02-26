import { Editor, EditorState, Modifier } from 'draft-js';
import userGetFirstName from 'core/utils/user/userGetFirstName';
import getTriggerIndexInSelection from './getTriggerIndexInSelection';

export default (editorState, triggerKey, id) => {
  const displayName = userGetFirstName(id);
  const apiString = `<!${id}|${displayName}>`;

  let contentState = editorState.getCurrentContent();
  let selection = editorState.getSelection();

  const triggerIndex = getTriggerIndexInSelection(editorState, triggerKey);

  selection = selection.set('anchorOffset', triggerIndex);

  contentState = contentState.createEntity('MENTION', 'IMMUTABLE', {
    apiString
  });

  contentState = Modifier.replaceText(
    contentState,
    selection,
    displayName,
    null,
    contentState.getLastCreatedEntityKey()
  );

  editorState = EditorState.set(editorState, { currentContent: contentState });

  const targetO = selection.get('anchorOffset') + displayName.length;
  selection = selection
    .set('anchorOffset', targetO)
    .set('focusOffset', targetO);

  editorState = EditorState.acceptSelection(editorState, selection);

  return editorState;
};
