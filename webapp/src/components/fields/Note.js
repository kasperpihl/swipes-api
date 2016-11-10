import React, { Component, PropTypes } from 'react'
import Button from '../swipes-ui/Button'

import './styles/note.scss'
import {
  Editor,
  createEditorState
} from 'medium-draft';
import {
  convertFromRaw,
  EditorState,
  convertToRaw
} from 'draft-js'

class Note extends Component {
  constructor(props) {
    super(props)
    const index = props.id + '-note';
    let editorState = createEditorState();
    let localState = localStorage.getItem(index);

    if (!localState) {
      const data = props.data;
      localState = JSON.stringify(props.data);
    }
    if (localState) {
      const blockData = JSON.parse(localState);
      editorState = EditorState.push(editorState, convertFromRaw(blockData));
    }


    this.state = { editorState };
    this.onChange = (editorState) => {
      const index = this.props.id + '-note';
      localStorage.setItem(index, JSON.stringify(convertToRaw(editorState.getCurrentContent())))
      this.setState({ editorState });
    };
  }
  componentDidMount() {
  }
  render() {
    const {editorState} = this.state;
    return (
      <div className="deliver-note">
        <Editor
          editorState={editorState}
          onChange={this.onChange}
        />
      </div>
    )
  }
}
export default Note

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Note.propTypes = {
}
