import React, { Component, PropTypes } from 'react'

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
  static getIcon(){
    return 'SlackIcon';
  }
  constructor(props) {
    super(props)
    let editorState = createEditorState();

    if (props.data) {
      const blockData = JSON.parse(JSON.stringify(props.data))
      editorState = EditorState.push(editorState, convertFromRaw(blockData));
    }

    this.state = { editorState };
    this.onChange = this.onChange.bind(this);

  }
  onChange(editorState){
    const { onChange } = this.props;
    this.setState({ editorState });
    onChange(convertToRaw(editorState.getCurrentContent()))
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
