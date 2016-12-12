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
    this.state = { editorState: this.parseInitialData() };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {

  }
  onChange(editorState) {
    this.setState({ editorState });
  }
  saveData(data) {
    return data.set('editorState', convertToRaw(data.get('editorState').getCurrentContent()));
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
    const { note } = this.props;
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
  return {
    note: state.getIn(['notes', state.getIn(['main', 'activeGoalId'])]),
  };
}

export default connect(mapStateToProps, {
  // saveNote: actions.note.save,
})(HOCSideNote);
