import { useState, useCallback, useRef } from 'react';
import useDebouncedCallback from 'src/react/_hooks/useDebouncedCallback';
import useRequest from 'core/react/_hooks/useRequest';
import useUpdate from 'core/react/_hooks/useUpdate';
import useBeforeUnload from 'src/react/_hooks/useBeforeUnload';
import useUnmountedRef from 'src/react/_hooks/useUnmountedRef';
import { convertToRaw } from 'draft-js';
import getDiffServerClient from 'src/utils/draft-js/getDiffServerClient';
import request from 'core/utils/request';

export default function useSyncedNote(noteId) {
  const unmountedRef = useUnmountedRef();
  const [rev, setRev] = useState();
  const [rawState, setRawState] = useState();

  const req = useRequest(
    'note.get',
    {
      note_id: noteId
    },
    res => {
      if (unmountedRef.current) return;
      setRev(res.note.rev);
      setRawState(res.note.text);
    }
  );

  const handleUpdateRef = useRef();
  const [lastServerContentState, setLastServerContentState] = useState();
  const [lastContentState, setLastContentState] = useState();
  const [editorState, _setEditorState] = useState();

  async function fetchNote() {
    const res = await request('note.get', {
      note_id: noteId
    });

    if (!res.ok) {
      throw Error('Could not fetch newest note');
    }
    return res.note;
  }

  handleUpdateRef.current = function(latestNote) {
    const needSave = editorState.getCurrentContent() !== lastServerContentState;
    let rawState = latestNote.text;
    if (needSave) {
      rawState = getDiffServerClient(
        convertToRaw(lastServerContentState),
        latestNote.text,
        convertToRaw(editorState.getCurrentContent())
      ).editorState;

      saveToServer(rawState, latestNote.rev);
    }

    if (!unmountedRef.current) {
      setRev(latestNote.rev);
      setRawState(rawState);
    }
  };

  async function saveToServer(rawState, _rev) {
    let res = await request('note.update', {
      note_id: noteId,
      rev: _rev,
      text: JSON.stringify(rawState)
    });

    if (res.error === 'Out of sync') {
      const latestNote = await fetchNote();
      handleUpdateRef.current(latestNote);
    }

    if (unmountedRef.current) return;
    if (res.ok && res.rev > rev) {
      setRev(res.rev);
    }
    return res;
  }

  useUpdate('note', async note => {
    if (note.note_id === noteId && note.rev > rev) {
      const latestNote = await fetchNote();
      handleUpdateRef.current(latestNote);
    }
  });

  const bouncedSaveToServer = useDebouncedCallback(
    () => saveToServer(convertToRaw(editorState.getCurrentContent()), rev),
    5000,
    [editorState, rev]
  );

  useBeforeUnload(() => {
    saveToServer(convertToRaw(editorState.getCurrentContent()), rev);
  });

  const setEditorState = useCallback(
    function(editorState) {
      const contentState = editorState.getCurrentContent();
      if (rawState) {
        setLastServerContentState(contentState);
        setRawState(undefined);
      } else if (contentState !== lastContentState) {
        bouncedSaveToServer();
      }
      setLastContentState(contentState);
      _setEditorState(editorState);
    },
    [rawState, lastContentState]
  );

  return {
    editorState,
    req,
    setEditorState,
    rawState
  };
}
