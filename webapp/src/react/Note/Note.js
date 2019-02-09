import React, { useRef } from 'react';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import SWView from 'src/react/_Layout/view-controller/SWView';
import withSyncedNote from 'src/react/_hocs/withSyncedNote';
import NoteEditor from 'src/react/_components/note-editor/NoteEditor';

import SW from './Note.swiss';

Note.sizes = [698];
export default withSyncedNote(Note);

function Note({ updateNote, note, noteDisabled, editorState }) {
  const delegateRef = useRef({
    setEditorState: updateNote
  });
  const rawState = !editorState && note.get('text').toJS();

  return (
    <SWView header={<CardHeader title={note.get('title')} />}>
      <SW.Wrapper>
        <NoteEditor
          mediumEditor
          rawState={rawState}
          editorState={editorState}
          disabled={noteDisabled}
          delegate={delegateRef.current}
        />
      </SW.Wrapper>
    </SWView>
  );
}
