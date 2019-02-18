import React, { useRef } from 'react';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import SWView from 'src/react/_Layout/view-controller/SWView';
import useSyncedNote from 'src/react/_hooks/useSyncedNote';
import NoteEditor from 'src/react/_components/note-editor/NoteEditor';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';

import SW from './Note.swiss';

Note.sizes = [698];

export default function Note({ noteId }) {
  const { editorState, setEditorState, req, rawState } = useSyncedNote(noteId);

  const delegate = useRef({});
  delegate.current.setEditorState = setEditorState;

  if (req.error || req.loading) {
    return <RequestLoader req={req} />;
  }

  const { note } = req.result;

  return (
    <SWView header={<CardHeader title={note.title} />}>
      <SW.Wrapper>
        <NoteEditor
          mediumEditor
          rawState={rawState}
          editorState={editorState}
          delegate={delegate.current}
        />
      </SW.Wrapper>
    </SWView>
  );
}
