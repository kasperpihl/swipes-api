import React, { Component, PropTypes } from 'react'

import '../styles/note.scss'
import {
  Editor,
  createEditorState,
} from 'medium-draft';

class Note extends Component {
  constructor(props) {
    super(props)
    this.state = {editorState: createEditorState()};
    this.onChange = (editorState) => {
      this.setState({ editorState });
    };
  }
  componentDidMount() {
  }
  render() {
    const {editorState} = this.state;
    return (
      <Editor
        editorState={editorState}
        onChange={this.onChange}
      />
    )
  }
}
export default Note

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Note.propTypes = {
}