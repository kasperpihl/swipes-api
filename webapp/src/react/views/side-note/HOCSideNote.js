import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import NoteEditor from 'components/note-editor/NoteEditor';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import {
  convertToRaw,
} from 'draft-js';
import diff from 'classes/draft-util';

import { bindAll, debounce } from 'classes/utils';
import * as actions from 'actions';

import './styles/side-note';

const maxWidth = 740;

class HOCSideNote extends PureComponent {
  static maxWidth() {
    return maxWidth;
  }
  static fullscreen() {
    return true;
  }
  constructor(props) {
    super(props);
    this.state = { hasChanged: false };
    bindAll(this, ['setEditorState', 'bouncedSaveNote', 'onBlur']);
    this.bouncedSaveNote = debounce(this.bouncedSaveNote, 3000);
  }
  componentWillUnmount() {

  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.note !== this.props.note) {
      console.log(this._lastSavedRev, nextProps.note.get('rev'));
    }
  }

  setEditorState(editorState) {
    const { hasChanged } = this.state;
    const newState = { editorState };
    const lastUndo = editorState.getUndoStack();
    if (lastUndo.size !== (this._lastUndo || 0)) {
      console.log('changed!');
      this.bouncedSaveNote();
      newState.hasChanged = true;
    }
    this.setState(newState);
    this._lastUndo = lastUndo.size;
  }

  saveNote(editorState, rev) {
    const {
      saveNote,
      id,
      organizationId,
    } = this.props;
    const raw = convertToRaw(editorState.getCurrentContent());
    saveNote(organizationId, id, raw, rev).then((res) => {
      if (res && res.ok) {
        console.log(res.note.rev);
        this._lastSavedRev = res.note.rev;
      } else if (res && !res.ok) {
        if (res.error && res.error.message === 'merge_needed') {

        }
      }
      console.log('res', res);
    });
  }
  bouncedSaveNote() {
    const { editorState } = this.state;
    const { note } = this.props;
    this.saveNote(editorState, note.get('rev'));
  }

  renderHeader() {
    const { target, note } = this.props;
    const subtitle = 'Me is cool';
    const title = note && note.get('title');
    return (
      <div className="side-note__header">
        <HOCHeaderTitle
          title={title}
          target={target}
          subtitle={subtitle}
        />
      </div>
    );
  }

  render() {
    const { note } = this.props;
    const { editorState } = this.state;
    if (!editorState && !note) {
      return null;
    }

    const rawState = editorState ? undefined : note.toJS().text;

    return (
      <SWView header={this.renderHeader()} maxWidth={maxWidth}>
        <div className="side-note">
          <NoteEditor
            rawState={rawState}
            ref="editor"
            editorState={editorState}
            setEditorState={this.setEditorState}
            onBlur={this.onBlur}
          />
        </div>
      </SWView>
    );
  }
}

const { string, func } = PropTypes;
HOCSideNote.propTypes = {
  note: map,
  id: string,
  organizationId: string,
  saveNote: func,
  target: string,
};

function mapStateToProps(state, ownProps) {
  return {
    organizationId: state.getIn(['me', 'organizations', 0, 'id']),
    note: state.getIn(['notes', ownProps.id]),
  };
}

export default connect(mapStateToProps, {
  saveNote: actions.main.note.save,
})(HOCSideNote);
