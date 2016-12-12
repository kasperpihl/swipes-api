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
    this.state = { editorState: this.parseInitialData() };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onChange = this.onChange.bind(this);
    bindAll(this, ['onChange', 'saveNote']);
    this.throttledSave = throttle(this.saveNote, 5000);
  }
  componentWillReceiveProps(nextProps) {
    const { me, note } = this.props;

    if (nextProps.note && nextProps.note !== note) {
      if (!note || (me && me.get('id') !== nextProps.note.get('locked_by'))) {
        this.setState({ editorState: this.parseInitialData(nextProps.note.get('text')) });
      }
    }
  }
  onChange(editorState) {
    this.setState({ editorState });
    this.throttledSave(editorState);
  }
  saveNote(editorState) {
    const {
      saveNote,
      goalId,
      navId,
    } = this.props;

    saveNote(navId, goalId, this.saveData(editorState));
  }
  saveData(data) {
    return convertToRaw(data.getCurrentContent());
  }
  parseInitialData(initialState) {
    let editorState = NoteEditor.getEmptyEditorState();
    if (initialState) {
      console.log(initialState.toJS());
      const raw = JSON.parse(JSON.stringify(initialState.toJS()));
      editorState = EditorState.push(editorState, convertFromRaw(raw));
    }

    return editorState;
  }
  componentDidMount() {
  }
  render() {
    const { note, goalId } = this.props;
    if (!goalId) {
      return null;
    }

    const { editorState } = this.state;

    return (
      <div className="side-note">
        <NoteEditor
          editorState={editorState}
          onChange={this.onChange}
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
  };
}

export default connect(mapStateToProps, {
  saveNote: actions.main.saveNote,
})(HOCSideNote);
