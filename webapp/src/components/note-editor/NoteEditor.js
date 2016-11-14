import React, { Component, PropTypes } from 'react'
import {Editor, EditorState, SelectionState, RichUtils, ContentBlock, getVisibleSelectionRect } from 'draft-js'
import { bindAll } from '../../classes/utils'

import './styles/note-editor.scss'

class NoteEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasSelected: false,
      styleControl: {show: false},
      // { show: true, mousePos: {x, y} }
      editorState: EditorState.createEmpty() // Initiate Editor
    }
    bindAll(this, ['onBlur', 'onKeyDown', 'onKeyUp', 'onMouseDown', 'onMouseMove', 'onMouseUp', 'toggleBlockType', 'handleKeyCommand']);
    this.onChange = (editorState) => {
      const sel = editorState.getSelection();
      const hasSelected = ( sel.anchorKey !== sel.focusKey || sel.anchorOffset !== sel.focusOffset)

      let styleControl = this.state.styleControl;
      if(!hasSelected && styleControl.show){
        styleControl = {show: false};
      }
      this.setState({ editorState, hasSelected, styleControl });
    }
  }
  componentDidMount() {
  }
  handleKeyCommand(keyCommand) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, keyCommand);

    if (newState) {
      this.onChange(newState)
      return 'handled'
    }

    return 'not handled'
  }
  toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }
  positionForStyleControls(){
    const selectionRect = getVisibleSelectionRect(window);
    return selectionRect;
  }
  renderStyleControls() {
    const { editorState, hasSelected, styleControl } = this.state;

    if(!styleControl.show || !hasSelected){
      return;
    }

    const position = this.positionForStyleControls();
    if(!position){
      return;
    }


    const selectionState = editorState.getSelection();

    return (
      <BlockStyleControls
        editorState={editorState}
        onToggle={this.toggleBlockType}
        position={position}
      />
    )
  }
  onKeyDown(e){
    if(e.keyCode === 16){
      console.log('shift down');
      const { styleControl } = this.state;
      if(styleControl.show){
        this.shiftKeyTest = true;
        setTimeout(() => {
          if(this.shiftKeyTest){
            this.setState({styleControl: {show: false}})
          }
        }, 500)
      }
    }
  }
  onBlur(e){
  }
  onKeyUp(e){
    if(e.keyCode === 16){
      this.shiftKeyTest = false;
    }
  }
  onMouseDown(e){

  }
  setStyleControl(styleControlVal){
    const { editorState, styleControl, hasSelected } = this.state;
    const selectionState = editorState.getSelection();
    if (!styleControl.show && hasSelected && selectionState.getHasFocus()){
      this.setState({styleControl: styleControlVal});
    }
  }
  onMouseUp(e){
    const x = e.pageX;
    const y = e.pageY;
    setTimeout(() => {
      this.setStyleControl({ show: true, mousePos: {x, y}});
    }, 1)

  }
  onMouseMove(e){
    setTimeout(() => {
      this.setStyleControl({ show: true });
    }, 1)
  }
  render() {
    const { editorState } = this.state;
    return (
      <div className="sw-text-editor"
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onMouseMove={this.onMouseMove}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}>
        {this.renderStyleControls()}
        <Editor
          editorState={editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
          blockStyleFn={this.handleBlock}
        />
      </div>
    )
  }
}

const BlockStyleControls = (props) => {
  const { editorState, position } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'}
  ];


  // let style = {
  //   top: position.top,
  //   transform: 'translateY(-120%) translateX(-50%)'
  // }

  let style = {
    left: position.left,
    top: position.top,
    transform: 'translateY(-120%) translateX(-50%)'
  };

  return (
    <div className="RichEditor-controls" style={style}>
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

const StyleButton = (props) => {
  let className = 'RichEditor-styleButton';

  if (props.active) {
    className += ' RichEditor-activeButton';
  }

  const toggle = (e) => {
    e.preventDefault();
    props.onToggle(props.style);
  }

  return (
    <span className={className} onMouseDown={toggle}>
      {props.label}
    </span>
  );
}


export default NoteEditor

const { string } = PropTypes;

NoteEditor.propTypes = {

}
