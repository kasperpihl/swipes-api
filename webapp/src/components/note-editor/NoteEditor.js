import React, { Component, PropTypes } from 'react'
import {Editor, EditorState, SelectionState, RichUtils, ContentBlock, getVisibleSelectionRect } from 'draft-js'
import StyleControl from './StyleControl'

import { bindAll } from '../../classes/utils'
import * as Icons from '../icons'

import './styles/note-editor.scss'

class NoteEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasSelected: false,
      styleControl: {show: false}
    }
    bindAll(this,
      [
        'onBlur',
        'onKeyDown',
        'onKeyUp',
        'onMouseMove',
        'onMouseUp',
        'toggleBlockType',
        'toggleInlineStyle',
        'handleKeyCommand',
        'onTab'
      ]
    );
    this.onChange = (editorState) => {
      const sel = editorState.getSelection();
      const hasSelected = ( sel.anchorKey !== sel.focusKey || sel.anchorOffset !== sel.focusOffset)

      let styleControl = this.state.styleControl;
      if(!hasSelected && styleControl.show){
        styleControl = {show: false};
      }
      if(this.props.onChange){
        this.props.onChange(editorState);
      }
      this.setState({ hasSelected, styleControl });
    }
  }
  handleKeyCommand(keyCommand) {
    const { editorState } = this.props;
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
        this.props.editorState,
        blockType
      )
    );
  }
  toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.props.editorState,
        inlineStyle
      )
    );
  }
  onTab(e) {
    const { editorState } = this.props;
    const maxDepth = 4;
    e.preventDefault()
    this.onChange(RichUtils.onTab(e, editorState, maxDepth));
  }
  positionForStyleControls(){
    const selectionRect = getVisibleSelectionRect(window);
    return selectionRect;
  }
  renderStyleControls() {
    const { hasSelected, styleControl } = this.state;
    const { editorState } = this.props;
    if(!styleControl.show || !hasSelected){
      return;
    }

    const position = this.positionForStyleControls();

    if(!position){
      return;
    }

    const selectionState = editorState.getSelection();

    return (
      <StyleControl
        editorState={editorState}
        onToggleBlock={this.toggleBlockType}
        onToggleInline={this.toggleInlineStyle}
        position={position}
        mouseUp={styleControl}
      />
    )
  }
  onKeyDown(e){
    if(e.keyCode === 16){
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
  setStyleControl(styleControlVal){
    const { styleControl, hasSelected } = this.state;
    const { editorState } = this.props;
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
    const { editorState, readOnly } = this.props;
    return (
      <div ref="rooty" className="sw-text-editor"
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}>
        {this.renderStyleControls()}
        <Editor
          readOnly={readOnly}
          editorState={editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
          blockStyleFn={this.handleBlock}
          onTab={this.onTab}
          placeholder="Write something cool in me"
        />
      </div>
    )
  }
}

export default NoteEditor

const { string } = PropTypes;

NoteEditor.propTypes = {

}
