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

const UNLOCK_TIMER = 10000;

class HOCSideNote extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState: this.parseInitialData(), locked: false, editing: false };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['onChange', 'saveNote', 'onBlur']);
    this.bouncedSaveNote = debounce(this.bouncedSaveNote, 5000);
  }

  onChange(editorState) {
    const { editing } = this.state;

    const changeObj = { editorState };
    const lastUndo = editorState.getUndoStack().first();
    // If you are editing or if not the last undo item has changed.
    // This enables us to not lock the note for others on selection, focus etc.
    if (editing || this.lastUndo !== lastUndo) {
      if (editorState.getSelection().hasFocus) {
        this.bouncedSaveNote();
      }
      if (!editing) {
        this.saveNote(false, editorState);
        changeObj.editing = true;
      }
    }
    this.setState(changeObj);

    this.lastUndo = lastUndo;
  }

  clearTimer() {
    if (this.lockTimer) {
      clearTimeout(this.lockTimer);
      this.lockTimer = null;
    }
  }
  lockUI(timeleft) {
    this.clearTimer();
    this.lockTimer = setTimeout(() => {
      this.unlockUI();
    }, timeleft);

    if (!this.state.locked) {
      this.setState({ locked: true });
    }
  }
  unlockUI() {
    this.clearTimer();
    if (this.state.locked) {
      this.setState({ locked: false, editing: false });
    }
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
    this.saveNote(false, editorState);
  }

  componentWillReceiveProps(nextProps) {
    const { me, note: oldNote } = this.props;
    const { note: newNote } = nextProps;
    if (oldNote && !newNote) {
      this.unlockUI();
    }
    if (newNote && newNote !== oldNote) {
      const newLock = newNote.get('locked_by');
      if (newLock) {
        const ts = parseInt(new Date(newNote.get('ts')).getTime(), 10);
        const now = parseInt(new Date().getTime(), 10);
        if (now < (ts + UNLOCK_TIMER)) {
          this.lockUI(Math.max((ts + UNLOCK_TIMER) - now, UNLOCK_TIMER));
        }
      } else {
        this.unlockUI();
      }
      const oldLock = oldNote && oldNote.get('locked_by');
      if (
        !oldNote ||
        (newLock && me.get('id') !== newLock) ||
        (!newLock && oldLock && oldLock !== me.get('id'))
      ) {
        console.log('setting new data');
        const editorState = this.parseInitialData(newNote.get('text'));
        this.setState({ editorState });
        // Using the last undo item to check if something has actually changed
        this.lastUndo = editorState.getUndoStack().first();
      }
    }
  }
  onBlur() {
    const { editing, editorState } = this.state;
    if (editing) {
      this.bouncedSaveNote.clear();
      this.saveNote(true, editorState);
    }
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
    if (locked && lockedBy && lockedBy !== me.get('id')) {
      const person = users.get(note.get('locked_by'));
      message = `${person.get('name')} is editing this note`;
    }
    if (editing) {
      message = 'You are editing this note';
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
