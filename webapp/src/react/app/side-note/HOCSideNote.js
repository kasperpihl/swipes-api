import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import NoteEditor from 'components/note-editor/NoteEditor';
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
    bindAll(this, ['onChange', 'bouncedSaveNote', 'onBlur']);
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
      if (!oldNote || newNote.get('user_id') !== me.get('id')) {
        console.log('new state');
        const editorState = this.parseInitialData(newNote.get('text'));
        this.lastUndo = editorState.getUndoStack().first();
        this.setState({ editorState, editing: false });
        // Using the last undo item to check if something has actually changed
      }
    }
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
  onBlur() {
    this.unlockUI();
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
      goalId,
      navId,
    } = this.props;

    saveNote(navId, goalId, this.convertDataToSave(editorState), unlock);
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

    let message = 'No one is editing this note';
    const lockedBy = note && note.get('locked_by');
    if (editing) {
      message = 'You are writing';
    }
    if (locked && lockedBy && lockedBy !== me.get('id')) {
      const person = users.get(note.get('locked_by'));
      message = `${person.get('name').split(' ')[0]} is writing`;
    }


    return (
      <div className="side-note__header">{message}</div>
    );
  }
  render() {
    const { goalId } = this.props;
    const { editorState, locked, editing } = this.state;
    if (!goalId || !editorState) {
      return null;
    }
    const someoneElseEditing = (locked && !editing);

    let className = 'side-note';

    if (someoneElseEditing) {
      className += ' side-note--locked';
    }
    return null;
    return (
      <div className={className}>
        {this.renderHeader()}
        <NoteEditor
          editorState={editorState}
          onChange={this.onChange}
          readOnly={someoneElseEditing}
          onBlur={this.onBlur}
        />
      </div>
    );
  }
}

const { string, func } = PropTypes;
HOCSideNote.propTypes = {
  goalId: string,
  note: map,
  me: map,
  navId: string,
  users: map,
  saveNote: func,
};

function mapStateToProps(state) {
  const navId = state.getIn(['navigation', 'id']);
  const history = state.getIn(['navigation', 'history', navId]);
  const currentView = history ? history.last() : undefined;
  let goalId;
  if (currentView) {
    goalId = currentView.getIn(['props', 'goalId']);
  }
  return {
    goalId,
    me: state.get('me'),
    navId,
    note: state.getIn(['notes', goalId]),
    users: state.get('users'),
  };
}

export default connect(mapStateToProps, {
  saveNote: actions.main.saveNote,
})(HOCSideNote);
