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

import { bindAll, throttle } from 'classes/utils';
import * as actions from 'actions';

import './styles/side-note';

class HOCSideNote extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState: this.parseInitialData(), locked: false };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['onChange', 'saveNote', 'onBlur']);
    this.throttledSave = throttle(this.saveNote, 5000);
    this.isEditing = false;
  }

  onChange(editorState) {
    this.setState({ editorState });
    const lastUndo = editorState.getUndoStack().first();
    // If you are editing or if not the last undo item has changed.
    // This enables us to not lock the note for others on selection, focus etc.
    if (this.isEditing || this.lastUndo !== lastUndo) {
      this.isEditing = true;
      this.throttledSave();
    }
    this.lastUndo = lastUndo;
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  lockUI(timeleft) {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.unlockUI();
    }, timeleft * 1000);

    if (!this.state.locked) {
      this.isEditing = false;
      this.setState({ locked: true });
    }
  }
  unlockUI() {
    this.clearTimer();
    if (this.state.locked) {
      this.setState({ locked: false });
    }
  }


  saveNote(unlock) {
    const {
      saveNote,
      goalId,
      navId,
    } = this.props;
    const { editorState } = this.state;
    saveNote(navId, goalId, this.saveData(editorState), unlock);
  }

  componentWillReceiveProps(nextProps) {
    const { me, note } = this.props;
    if (this.props.note && !nextProps.note) {
      this.setState({ editorState: null, locked: false });
      this.isEditing = false;
    }
    if (nextProps.note && nextProps.note !== note) {
      const lockedBy = nextProps.note.get('locked_by');
      if (lockedBy && lockedBy !== me.get('id')) {
        const ts = parseInt(new Date(nextProps.note.get('ts')).getTime() / 1000, 10);
        const now = parseInt(new Date().getTime() / 1000, 10);
        if (now < (ts + 10)) {
          this.lockUI(Math.max((ts + 10) - now, 10));
        }
      } else if (!lockedBy && note && note.get('locked_by')) {
        this.unlockUI();
      }
      const oldLock = note && note.get('locked_by');
      if (
        !note ||
        (lockedBy && me.get('id') !== lockedBy) ||
        (!lockedBy && oldLock && oldLock !== me.get('id'))
      ) {
        console.log('setting new note');
        const editorState = this.parseInitialData(nextProps.note.get('text'));
        this.setState({ editorState });
        // Using the last undo item to check if something has actually changed
        this.lastUndo = editorState.getUndoStack().first();
      }
    }
  }
  onBlur() {
    if (this.throttledSave.isRunning()) {
      this.throttledSave.cancel();
      this.saveNote(true);
      this.isEditing = false;
    }
  }


  saveData(data) {
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
    const { note, users } = this.props;
    const { locked } = this.state;
    const person = users.get(note.get('locked_by'));
    let message = 'No one is editing this note';
    if (this.isEditing) {
      message = 'You are editing this note';
    }
    if (locked) {
      message = `${person.get('name')} is editing this note`;
    }

    return (
      <div className="side-note__header">{message}</div>
    );
  }
  render() {
    const { note, goalId } = this.props;
    const { editorState, locked } = this.state;
    if (!goalId || !editorState) {
      return null;
    }

    let className = 'side-note';

    if (locked) {
      className += ' side-note--locked';
    }

    return (
      <div className={className}>
        {this.renderHeader()}
        <NoteEditor
          editorState={editorState}
          onChange={this.onChange}
          readOnly={locked}
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
