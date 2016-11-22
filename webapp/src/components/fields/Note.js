import React, { Component, PropTypes } from 'react'
import SwipesCard from '../swipes-card/SwipesCard'

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
    return 'ListIcon';
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
    const { delegate } = this.props;
    this.setState({ editorState });

    delegate('change', convertToRaw(editorState.getCurrentContent()))
  }
  onCardClick(card){
    const { delegate } = this.props;
    delegate('fullscreen', delegate);
  }
  renderNoteCard(){
    const { options } = this.props;
    if(options.fullscreen){
      return;
    }
    const { editorState } = this.state;

    return <SwipesCard delegate={this} data={{
      title: 'Untitled note',
      description: editorState.getCurrentContent().getPlainText().substr(0,100)
    }}/>
  }
  renderNoteEditor(){
    const { options } = this.props;
    if(!options.fullscreen){
      return;
    }
    const {editorState} = this.state;
    return (
      <Editor
        editorState={editorState}
        onChange={this.onChange}
      />
    )
  }
  render() {
    return (
      <div className="deliver-note">
        {this.renderNoteEditor()}
        {this.renderNoteCard()}
      </div>
    )
  }
}
export default Note

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Note.propTypes = {
}
