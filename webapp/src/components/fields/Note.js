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
  static saveData(data){
    return data.set('editorState', convertToRaw(data.get('editorState').getCurrentContent()))
  }
  static parseInitialData(data){
    let editorState = createEditorState();
    if(data && data.get('editorState')){
      const raw = JSON.parse(JSON.stringify(data.get('editorState').toJS()))
      editorState = EditorState.push(editorState, convertFromRaw(raw));
    }

    data = data.set('editorState', editorState);
    return data;
  }
  constructor(props) {
    super(props)
    this.state = { data: props.data };
    this.onChange = this.onChange.bind(this);
  }
  onChange(editorState){
    const { delegate } = this.props;
    const { data } = this.state;
    delegate('change', data.set('editorState', editorState));
  }
  componentWillReceiveProps(nextProps){
    this.setState({ data: nextProps.data });
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
    const { data } = this.state;

    return <SwipesCard delegate={this} data={{
      title: 'Untitled note',
      description: data.get('editorState').getCurrentContent().getPlainText().substr(0,100)
    }}/>
  }
  renderNoteEditor(){
    const { options } = this.props;
    if(!options.fullscreen){
      return;
    }
    const { data } = this.state;
    return (
      <Editor
        editorState={data.get('editorState')}
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
