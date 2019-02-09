import React, { PureComponent } from 'react';
import { fromJS } from 'immutable';
import { convertToRaw } from 'draft-js';
import hoistNonReactStatics from 'hoist-non-react-statics';
import getDiffServerClient from 'src/utils/draft-js/getDiffServerClient';

import debounce from 'swipes-core-js/utils/debounce';
import request from 'swipes-core-js/utils/request';

export default WrappedComponent => {
  class WithSyncedNote extends PureComponent {
    state = {
      note: null
    };
    componentDidMount() {
      window.addEventListener('beforeunload', this.handleBeforeUnload);
      const { noteId } = this.props;
      request('note.get', {
        note_id: noteId
      }).then(res => {
        !this._unmounted && this.setState({ note: fromJS(res.note) });
      });
    }
    componentWillUnmount() {
      this._unmounted = true;
      this.bouncedSaveToServer.clear();
      this.saveToServer();
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }
    handleBeforeUnload = () => this.saveToServer();
    fetchNote = () =>
      request('note.get', {
        note_id: this.props.noteId
      });
    updateNoteState = note => {
      !this._unmounted && this.setState({ note });
    };
    updateNote = editorState => {
      if (!this.state.editorState) {
        this.lastSentToServer = editorState.getCurrentContent();
      }
      this.setState({ editorState }, this.bouncedSaveToServer);
    };
    bouncedSaveToServer = debounce(() => this.saveToServer(), 3000);
    saveToServer = (forcedRawState, forcedRev) => {
      const { noteId } = this.props;
      const { editorState, note } = this.state;
      const contentState = editorState.getCurrentContent();
      if (!forcedRawState && contentState === this.lastSentToServer) {
        return;
      }

      const rawState = forcedRawState || convertToRaw(contentState);
      const rev = forcedRev || note.get('rev');

      request('note.update', {
        note_id: noteId,
        rev,
        text: JSON.stringify(rawState)
      }).then(res => {
        if (res.ok) {
          this.lastSentToServer = contentState;
          this.updateNoteState(this.state.note.merge(fromJS(res.note)));
        } else if (res.error === 'Out of sync') {
          this.fixConflict();
        }
      });
    };
    fixConflict = async () => {
      !this._unmounted && this.setState({ noteDisabled: true });
      const { note, editorState } = this.state;
      const noteRes = await this.fetchNote();
      if (!noteRes.ok) {
        throw Error('Could not fetch newest note');
      }

      const latestNote = noteRes.note;

      const diffObj = getDiffServerClient(
        latestNote.text,
        note.get('text').toJS(),
        convertToRaw(editorState.getCurrentContent())
      );

      this.saveToServer(diffObj.editorState, latestNote.rev);
    };
    render() {
      const { note, noteDisabled, editorState } = this.state;
      if (!note) {
        return <div>Loading...</div>;
      }
      return (
        <WrappedComponent
          note={note}
          editorState={editorState}
          updateNote={this.updateNote}
          noteDisabled={noteDisabled}
          {...this.props}
        />
      );
    }
  }
  hoistNonReactStatics(WithSyncedNote, WrappedComponent);
  return WithSyncedNote;
};
