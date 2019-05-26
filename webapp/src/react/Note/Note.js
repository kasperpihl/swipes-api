import React, { useRef, useEffect } from 'react';
import moment from 'moment';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import useSyncedNote from 'src/react/_hooks/useSyncedNote';
import NoteEditor from 'src/react/_components/note-editor/NoteEditor';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import userGetFirstName from 'core/utils/user/userGetFirstName';

import SW from './Note.swiss';

Note.sizes = [698];

export default function Note({ noteId }) {
  const { editorState, setEditorState, req, rawState, isDirty } = useSyncedNote(
    noteId
  );
  const wasDirty = useRef(false);
  useEffect(() => {
    if (isDirty) {
      wasDirty.current = true;
    }
  }, [isDirty]);

  const delegate = useRef({});
  delegate.current.setEditorState = setEditorState;

  if (req.error || req.loading) {
    return <RequestLoader req={req} />;
  }

  const { note } = req.result;

  let subtitle = 'Saving...';
  if (!isDirty) {
    subtitle = 'All changes saved to Swipes';
    if (!wasDirty.current) {
      const d = moment(note.updated_at);
      subtitle = 'Last edit was ';
      if (d.diff(moment(), 'days') > -7) {
        subtitle += d.fromNow();
      } else {
        subtitle += `on ${d.format('ll')}`;
      }
      subtitle += ` by ${userGetFirstName(note.owned_by, note.updated_by)}`;
    }
  }

  return (
    <CardContent
      header={<CardHeader separator title={note.title} subtitle={subtitle} />}
    >
      <SW.Wrapper>
        <NoteEditor
          mediumEditor
          rawState={rawState}
          editorState={editorState}
          delegate={delegate.current}
        />
      </SW.Wrapper>
    </CardContent>
  );
}
