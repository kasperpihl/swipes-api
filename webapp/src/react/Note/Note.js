import React, { useRef } from 'react';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import SWView from 'src/react/_Layout/view-controller/SWView';
import useSyncedNote from 'src/react/_hooks/useSyncedNote';
import NoteEditor from 'src/react/_components/note-editor/NoteEditor';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';

import SW from './Note.swiss';

Note.sizes = [698];

export default function Note({ noteId }) {
  const { editorState, setEditorState, req, disabled } = useSyncedNote(noteId);

  const delegateRef = useRef({
    setEditorState
  });

  if (req.error || req.loading) {
    return <RequestLoader req={req} />;
  }

  const { note } = req.result;
  const rawState = !editorState && note.text;

  return (
    <SWView header={<CardHeader title={note.title} />}>
      <SW.Wrapper>
        <NoteEditor
          mediumEditor
          rawState={rawState}
          editorState={editorState}
          disabled={disabled}
          delegate={delegateRef.current}
        />
      </SW.Wrapper>
    </SWView>
  );
}
