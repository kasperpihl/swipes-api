import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import NoteEditor from 'components/note-editor/NoteEditor';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Map } from 'immutable';
import * as actions from 'actions';

import './styles/side-note';

class HOCSideNote extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  saveData(data) {
    return data.set('editorState', convertToRaw(data.get('editorState').getCurrentContent()));
  }
  parseInitialData(data) {
    let editorState = NoteEditor.getEmptyEditorState();
    if (data && data.get('editorState')) {
      console.log(data.get('editorState').toJS());
      const raw = JSON.parse(JSON.stringify(data.get('editorState').toJS()));
      editorState = EditorState.push(editorState, convertFromRaw(raw));
    }

    return data.set('editorState', editorState);
  }
  componentDidMount() {
  }
  render() {
    const { note } = this.props;

    const initialData = this.parseInitialData(Map());
    return (
      <div className="side-note">
        <NoteEditor
          editorState={initialData.get('editorState')}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    note: state.getIn(['notes', state.getIn(['main', 'activeGoalId'])]),
  };
}

export default connect(mapStateToProps, {
  // saveNote: actions.note.save,
})(HOCSideNote);
