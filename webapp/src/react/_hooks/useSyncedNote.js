import { useRef, useReducer, useEffect } from 'react';
import useDebouncedCallback from 'src/react/_hooks/useDebouncedCallback';
import useRequest from 'core/react/_hooks/useRequest';
import useUpdate from 'core/react/_hooks/useUpdate';
import useBeforeUnload from 'src/react/_hooks/useBeforeUnload';
import { convertToRaw } from 'draft-js';
import getDiffServerClient from 'src/utils/draft-js/getDiffServerClient';
import request from 'core/utils/request';

export default function useSyncedNote(noteId) {
  const syncRef = useRef({});
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  useEffect(
    () => () => {
      syncRef.current.unmounted = true;
    },
    []
  );

  const req = useRequest(
    'note.get',
    {
      note_id: noteId
    },
    res => {
      if (syncRef.current.unmounted) return;
      syncRef.current.lastServerRev = res.note.rev;
      syncRef.current.rawState = res.note.text;
      forceUpdate();
    }
  );

  async function fetchNote() {
    const res = await request('note.get', {
      note_id: noteId
    });

    if (!res.ok) {
      throw Error('Could not fetch newest note');
    }
    return res.note;
  }

  function handleUpdate(latestNote) {
    const needSave =
      syncRef.current.editorState.getCurrentContent() !==
      syncRef.current.lastServerContentState;
    let rawState = latestNote.text;
    if (needSave) {
      rawState = getDiffServerClient(
        convertToRaw(syncRef.current.lastServerContentState),
        latestNote.text,
        convertToRaw(syncRef.current.editorState.getCurrentContent())
      ).editorState;

      saveToServer(rawState, latestNote.rev);
    }

    if (!syncRef.current.unmounted) {
      syncRef.current.lastServerRev = latestNote.rev;
      syncRef.current.rawState = rawState;
      forceUpdate();
    }
  }

  async function saveToServer(rawState, _rev, onSuccess) {
    _rev = _rev || syncRef.current.lastServerRev;
    let res = await request('note.update', {
      note_id: noteId,
      rev: _rev,
      text: JSON.stringify(rawState)
    });

    if (res.error === 'Out of sync') {
      const latestNote = await fetchNote();
      handleUpdate(latestNote);
    }

    if (syncRef.current.unmounted) return;
    if (res.ok && res.rev > syncRef.current.lastServerRev) {
      if (typeof onSuccess === 'function') {
        onSuccess(res);
      }
      syncRef.current.lastServerRev = res.rev;
    }
    return res;
  }

  useUpdate('note', async note => {
    if (note.note_id === noteId && note.rev > syncRef.current.lastServerRev) {
      const latestNote = await fetchNote();
      handleUpdate(latestNote);
    }
  });

  const bouncedSaveToServer = useDebouncedCallback(
    () => {
      const contentStateToSave = syncRef.current.editorState.getCurrentContent();
      return saveToServer(
        convertToRaw(syncRef.current.editorState.getCurrentContent()),
        null,
        () => {
          syncRef.current.lastServerContentState = contentStateToSave;
          forceUpdate();
        }
      );
    },

    5000
  );

  useBeforeUnload(() => {
    if (syncRef.current.editorState) {
      saveToServer(
        convertToRaw(syncRef.current.editorState.getCurrentContent())
      );
    }
  });

  const setEditorState = function(editorState) {
    const contentState = editorState.getCurrentContent();
    if (syncRef.current.rawState) {
      syncRef.current.lastServerContentState = contentState;
      delete syncRef.current.rawState;
    } else if (contentState !== syncRef.current.lastContentState) {
      bouncedSaveToServer();
    }
    syncRef.current.lastContentState = contentState;
    syncRef.current.editorState = editorState;
    forceUpdate();
  };

  let isDirty = false;
  if (syncRef.current.editorState && syncRef.current.lastServerContentState) {
    isDirty =
      syncRef.current.lastServerContentState !==
      syncRef.current.editorState.getCurrentContent();
  }

  return {
    editorState: syncRef.current.editorState,
    isDirty,
    req,
    setEditorState,
    rawState: syncRef.current.rawState
  };
}
