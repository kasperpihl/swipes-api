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
    let editorState = NoteEditor.getEmptyEditorState()
    // if(data && data.get('editorState')){
    //   const raw = JSON.parse(JSON.stringify(data.get('editorState').toJS()))
    //   editorState = EditorState.push(editorState, convertFromRaw(raw));
    // }

    data = data.set('editorState', editorState);
    return data;
  }
  constructor(props) {
    super(props)
    this.state = { data: props.data, topPadding: 0 };
    this.onChange = this.onChange.bind(this);
    this.onDone = this.onDone.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
  }
  componentDidMount(){
    setTimeout(() => {
      this.paddingForContainer()
    }, 1);
  }
  componentDidUpdate(){
    this.paddingForContainer();
  }
  paddingForContainer(){
    const { paddingTop } = this.state;
    const { settings } = this.props;
    let padding = 0;
    if(settings.get('fullscreen')){
      const nH = this.refs.editor.refs.rooty.querySelector('.public-DraftEditor-content').firstChild.clientHeight;
      const tH = 250;
      const cH = this.refs.container.clientHeight;
      padding = (Math.max(cH - (nH + tH), 0))/2;
    }

    if(padding !== paddingTop){
      this.setState({paddingTop : padding});
    }
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

    return (
      <div className="sw-note-field__card">
        <SwipesCard delegate={this} data={{
          title: data.get('title') || 'Untitled note',
          description: data.get('editorState').getCurrentContent().getPlainText().substr(0,100)
        }}/>
      </div>
    )
  }
  renderNoteEditor(){
    const { settings } = this.props;
    if(!settings.get('fullscreen')){
      return;
    }
    const { data, paddingTop } = this.state;
    const styles = {paddingTop};
    return (
      <div className="sw-note-field__note-editor">
        <div className="sw-note-field__note" style={styles}>
          <input
            type="text"
            className="sw-note-field__title"
            placeholder="Untitled note"
            disabled={!settings.get('editable')}
            value={data.get('title') || ""}
            onChange={this.onTitleChange}
            autoFocus
          />
          <NoteEditor
            ref="editor"
            readOnly={settings.get('editable') ? false : true}
            editorState={data.get('editorState')}
            onChange={this.onChange} />
        </div>
        {this.renderSideColumn()}
      </div>
    )
  }
  renderSideColumn() {
    const { settings } = this.props;
    let className = 'sw-note-field__side';

    if (settings.get('editable')) {
      className += ' sw-note-field__side--status'
    }

    return (
      <div className="sw-note-field__side">
        {this.renderNoteStatus()}
        {this.renderNoteButton()}
      </div>
    )
  }
  onDone(e){
    const { delegate } = this.props;
    delegate('fullscreen');
  }
  renderNoteStatus() {
    const { settings } = this.props;

    if (settings.get('editable')) {
      return;
    }

    return <div className="sw-note-field__status">This note is not editable</div>
  }
  renderNoteButton() {
    return <div className="sw-note-field__button" onClick={this.onDone}>Done</div>
  }
  render() {
    return (
      <div ref="container" className="sw-note-field">
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
