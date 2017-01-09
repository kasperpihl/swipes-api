import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import NoteEditor from 'components/note-editor/NoteEditor';
import Button from 'Button';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
  convertFromRaw,
  EditorState,
  convertToRaw,
} from 'draft-js';

import { bindAll, debounce } from 'classes/utils';
import * as actions from 'actions';

import './styles/side-note';

const UNLOCK_TIMER = 30000;

class HOCSideNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: this.parseInitialData(),
      locked: false,
      editing: false,
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['onChange', 'bouncedSaveNote', 'onBlur', 'closeSideNote']);
    this.bouncedSaveNote = debounce(this.bouncedSaveNote, 3000);
  }

  componentWillReceiveProps(nextProps) {
    const { me, note: oldNote } = this.props;
    const { note: newNote } = nextProps;
    if (oldNote && !newNote) {
      // If we leave the note, unlock stuff.
      this.unlockUI();
      this.setState({ editorState: null });
    }
    if (newNote && newNote !== oldNote) {
      const newLock = newNote.get('locked_by');
      if (newLock) {
        const ts = parseInt(new Date(newNote.get('ts')).getTime(), 10);
        this.lockUI(ts);
      } else {
        this.unlockUI();
      }
      if (
        !oldNote ||
        newNote.get('id') !== oldNote.get('id') ||
        newNote.get('user_id') !== me.get('id')
      ) {
        console.log('new state');
        const editorState = this.parseInitialData(newNote.get('text'));
        this.lastUndo = editorState.getUndoStack().first();
        this.setState({ editorState, editing: false });
        // Using the last undo item to check if something has actually changed
      }
    }
  }
  onBlur() {
    this.unlockUI();
  }
  onChange(editorState) {
    const { editing } = this.state;

    const changeObj = { editorState };
    const lastUndo = editorState.getUndoStack().first();
    // If you are editing or if not the last undo item has changed.
    // This enables us to not lock the note for others on selection, focus etc.
    if (!editing && this.lastUndo !== lastUndo) {
      // Save immediately (with no changes to lock the doc)
      this.saveNote(false, this.state.editorState);
      // Call twice, to call immediately to lock, and on the timer with content
      this.bouncedSaveNote();
      changeObj.editing = true;
    }
    if (editing && editorState.getSelection().hasFocus) {
      this.bouncedSaveNote();
    }
    this.setState(changeObj);

    this.lastUndo = lastUndo;
  }
  closeSideNote() {
    const {
      hideNote,
    } = this.props;
    hideNote();
  }


  clearTimer() {
    if (this.lockTimer) {
      clearTimeout(this.lockTimer);
      this.lockTimer = null;
    }
  }
  lockUI(ts) {
    this.clearTimer();
    const now = parseInt(new Date().getTime(), 10);
    const timeleft = (ts + UNLOCK_TIMER) - now;
    if (timeleft > 0) {
      this.lockTimer = setTimeout(() => {
        this.unlockUI();
      }, timeleft);
      if (!this.state.locked) {
        this.setState({ locked: true });
      }
    }
  }
  unlockUI() {
    this.clearTimer();
    const { locked, editing, editorState } = this.state;
    const newState = {};
    if (editing) {
      newState.editing = false;
      if (this.bouncedSaveNote.isRunning()) {
        this.bouncedSaveNote.clear();
        this.saveNote(true, editorState);
      }
    }
    if (locked) {
      newState.locked = false;
    }
    this.setState(newState);
  }

  saveNote(unlock, editorState) {
    const {
      saveNote,
      sideNoteId,
      organizationId,
    } = this.props;

    saveNote(organizationId, sideNoteId, this.convertDataToSave(editorState), unlock);
  }
  bouncedSaveNote() {
    const { editorState } = this.state;
    this.saveNote(true, editorState);
  }

  convertDataToSave(data) {
    return convertToRaw(data.getCurrentContent());
  }
  parseInitialData(initialState) {
    let editorState = NoteEditor.getEmptyEditorState();
    if (initialState) {
      const raw = JSON.parse(JSON.stringify(initialState.toJS()));
      editorState = EditorState.push(editorState, convertFromRaw(raw));
    }

    return editorState;
  }
  renderHeader() {
    const { note, users, me } = this.props;
    const { locked, editing } = this.state;

    let dotClass = 'side-note__editing-dot';
    let message = '';
    const title = note && note.get('title');
    const lockedBy = note && note.get('locked_by');

    if (editing) {
      message = 'You are writing';
      dotClass += ' side-note__editing-dot--active-editing';
    }

    if (locked && lockedBy && lockedBy !== me.get('id')) {
      const person = users.get(note.get('locked_by'));

      dotClass += ' side-note__editing-dot--locked-editing';
      message = `${person.get('name').split(' ')[0]} is writing`;
    }

    return (
      <div className="side-note__header">
        <div className="side-note__btn-title">
          <Button icon="CloseIcon" className="side-note__back" onClick={this.closeSideNote} />
          <div className="side-note__title-wrap">
            <div className="side-note__title">
              {title}
            </div>
          </div>
        </div>
        {message}
        <div className={dotClass} />
      </div>
    );
  }
  render() {
    const { sideNoteId } = this.props;
    const { editorState, locked, editing } = this.state;

    if (!sideNoteId || !editorState) {
      return null;
    }

    const someoneElseEditing = (locked && !editing);
    let className = 'side-note';

    if (someoneElseEditing) {
      className += ' side-note--locked';
    }

    return (
      <div className={className}>
        {this.renderHeader()}

        <div className="side-note__note">
          <NoteEditor
            editorState={editorState}
            onChange={this.onChange}
            readOnly={someoneElseEditing}
            onBlur={this.onBlur}
          />
        </div>
      </div>
    );
  }
}

const { string, func } = PropTypes;
HOCSideNote.propTypes = {
  sideNoteId: string,
  note: map,
  organizationId: string,
  me: map,
  users: map,
  saveNote: func,
  hideNote: func,
};

function mapStateToProps(state) {
  const sideNoteId = state.getIn(['main', 'sideNoteId']);
  return {
    organizationId: state.getIn(['me', 'organizations', 0, 'id']),
    sideNoteId,
    me: state.get('me'),
    note: state.getIn(['notes', sideNoteId]),
    users: state.get('users'),
  };
}

export default connect(mapStateToProps, {
  saveNote: actions.main.note.save,
  hideNote: actions.main.note.hide,
})(HOCSideNote);
