import React, { PureComponent } from 'react';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import SWView from 'src/react/_Layout/view-controller/SWView';
import withSyncedNote from './withSyncedNote';
import NoteEditor from 'src/react/_components/note-editor/NoteEditor';

import SW from './SideNote.swiss';

@withSyncedNote
export default class SideNote extends PureComponent {
  static sizes = [698];
  setEditorState(editorState) {
    const { updateNote } = this.props;
    updateNote(editorState);
  }
  render() {
    const { note, noteDisabled, editorState } = this.props;

    const rawState = !editorState && note.get('text').toJS();

    return (
      <SWView header={<CardHeader title={note.get('title')} />}>
        <SW.Wrapper>
          <NoteEditor
            mediumEditor
            rawState={rawState}
            editorState={editorState}
            disabled={noteDisabled}
            delegate={this}
          />
        </SW.Wrapper>
      </SWView>
    );
  }
}
