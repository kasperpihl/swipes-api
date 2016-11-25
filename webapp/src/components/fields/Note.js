import React, { Component, PropTypes } from 'react'
import SwipesCard from '../swipes-card/SwipesCard'
import NoteEditor from '../note-editor/NoteEditor'

import './styles/note.scss'
import {
  convertFromRaw,
  EditorState,
  convertToRaw
} from 'draft-js'

class Note extends Component {
  static fullscreen(){
    return true;
  }
  static saveData(data){
    return data.set('editorState', convertToRaw(data.get('editorState').getCurrentContent()))
  }
  static parseInitialData(data){
    let editorState = EditorState.createEmpty();
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
    this.onTitleChange = this.onTitleChange.bind(this);
  }
  onChange(editorState){
    const { delegate } = this.props;
    const { data } = this.state;
    delegate('change', data.set('editorState', editorState));
  }
  onTitleChange(e){
    const { delegate } = this.props;
    const { data } = this.state;
    delegate('change', data.set('title', e.target.value));
  }
  componentWillReceiveProps(nextProps){
    this.setState({ data: nextProps.data });
  }
  onCardClick(card){
    const { delegate } = this.props;
    delegate('fullscreen');
  }
  renderNoteCard(){
    const { settings } = this.props;
    if(settings.get('fullscreen')){
      return;
    }
    const { data } = this.state;

    return <SwipesCard delegate={this} data={{
      title: data.get('title') || 'Untitled note',
      description: data.get('editorState').getCurrentContent().getPlainText().substr(0,100)
    }}/>
  }
  renderNoteEditor(){
    const { settings } = this.props;
    if(!settings.get('fullscreen')){
      return;
    }
    const { data } = this.state;
    return (
      <div className="note-editor-container">
        <input type="text" placeholder="Untitled note" value={data.get('title')} onChange={this.onTitleChange}/>
        <NoteEditor
          editorState={data.get('editorState')}
          onChange={this.onChange}
        />
      </div>
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
