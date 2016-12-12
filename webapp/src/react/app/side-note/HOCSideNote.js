import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
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
    this.onChange = this.onChange.bind(this);
    bindAll(this, ['onChange', 'saveNote']);
    this.throttledSave = throttle(this.saveNote, 5000);
  }
  lockUI(timeleft) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.setState({ locked: false });
    }, timeleft * 1000);
    if (!this.state.locked) {
      this.setState({ locked: true });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { me, note } = this.props;
    if (this.props.note && !nextProps.note) {
      this.setState({ editorState: null, locked: false });
    }
    if (nextProps.note && nextProps.note !== note) {
      let locked = false;
      if (nextProps.note.get('locked_by') !== me.get('id')) {
        const ts = parseInt(new Date(nextProps.note.get('ts')).getTime() / 1000, 10);
        const now = parseInt(new Date().getTime() / 1000, 10);
        if (now < (ts + 10)) {
          console.log('let lock this shit up');
          locked = true;
          this.lockUI(Math.max((ts + 10) - now, 10));
        }
      }

      if (!note || (me && me.get('id') !== nextProps.note.get('locked_by'))) {
        this.setState({ editorState: this.parseInitialData(nextProps.note.get('text')) });
      }
    }
  }
  onChange(editorState) {
    console.log(editorState.getLastChangeType());
    this.setState({ editorState });
    const lastUndo = editorState.getUndoStack().first();
    if (this.lastUndo && this.lastUndo !== lastUndo) {
      this.throttledSave();
    }
    this.lastUndo = lastUndo;
  }
  saveNote() {
    const {
      saveNote,
      goalId,
      navId,
    } = this.props;
    const { editorState } = this.state;
    saveNote(navId, goalId, this.saveData(editorState));
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
    let message = 'You are editing this note';

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
        />
      </div>
    );
  }
}

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
