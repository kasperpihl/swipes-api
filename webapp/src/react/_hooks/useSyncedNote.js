import { useState, useEffect, useRef } from 'react';
import useDebouncedCallback from 'src/react/_hooks/useDebouncedCallback';
import useRequest from 'src/react/_hooks/useRequest';
import { convertToRaw } from 'draft-js';
import getDiffServerClient from 'src/utils/draft-js/getDiffServerClient';
import request from 'swipes-core-js/utils/request';

export default function useSyncedNote(noteId) {
  const req = useRequest('note.get', {
    note_id: noteId
  });

  const unmounted = useRef();
  const lastSentToServerRef = useRef();
  const [disabled, setDisabled] = useState(false);
  const [editorState, _setEditorState] = useState();
  const saveToServerRef = useRef();

  saveToServerRef.current = async function saveToServer(
    forcedRawState,
    forcedRev
  ) {
    const contentState = editorState.getCurrentContent();
    if (!forcedRawState && contentState === lastSentToServerRef.current) {
      return;
    }

    const rawState = forcedRawState || convertToRaw(contentState);
    const rev = forcedRev || req.result.note.rev;

    let res = await request('note.update', {
      note_id: noteId,
      rev,
      text: JSON.stringify(rawState)
    });
    if (unmounted.current) return;

    if (res.ok) {
      lastSentToServerRef.current = contentState;
      setDisabled(false);
      req.merge('note', res.note);
      return;
    } else if (res.error !== 'Out of sync') {
      return;
    }

    // Resolve merge conflict
    setDisabled(true);
    res = await request('note.get', {
      note_id: noteId
    });
    if (unmounted.current) return;

    if (!res.ok) {
      throw Error('Could not fetch newest note');
    }

    const latestNote = res.note;

    const diffObj = getDiffServerClient(
      latestNote.text,
      note.text,
      convertToRaw(editorState.getCurrentContent())
    );

    saveToServer(diffObj.editorState, latestNote.rev);
  };

  const bouncedSaveToServer = useDebouncedCallback(() => {
    saveToServerRef.current();
  }, 5000);

  // Force save on unload (both killing app and unmounting)
  useEffect(() => {
    function beforeUnload() {
      console.log('save');
      saveToServerRef.current();
    }
    window.addEventListener('beforeunload', beforeUnload);
    return () => {
      unmounted.current = true;
      beforeUnload();
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, []);

  function setEditorState(editorState) {
    if (!lastSentToServerRef.current) {
      lastSentToServerRef.current = editorState.getCurrentContent();
    }
    _setEditorState(editorState);
    bouncedSaveToServer();
  }

  return {
    editorState,
    req,
    setEditorState,
    disabled
  };
}
