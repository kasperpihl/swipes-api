import React, { Component, PropTypes } from 'react'
import {Editor, EditorState} from 'draft-js';

import './styles/note.scss'

class Note extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty()
    }

    this.onChange = (editorState) => this.setState({editorState})
  }
  componentDidMount() {
  }
  render() {
    const { editorState } = this.state;

    return (
      <div className="sw-text-editor">
        <Editor editorState={editorState} onChange={this.onChange}/>
      </div>
    )
  }
}

export default Note

const { string } = PropTypes;

Note.propTypes = {

}
