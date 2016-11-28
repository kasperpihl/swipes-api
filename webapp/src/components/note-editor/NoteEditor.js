import React, { Component, PropTypes } from 'react'
import {Editor, EditorState, SelectionState, RichUtils, ContentBlock, getVisibleSelectionRect } from 'draft-js'
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
    bindAll(this, ['onBlur', 'onKeyDown', 'onKeyUp', 'onMouseMove', 'onMouseUp', 'toggleBlockType', 'toggleInlineStyle', 'handleKeyCommand']);
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
      <BlockStyleControls
        editorState={editorState}
        onToggleBlock={this.toggleBlockType}
        onToggleInline={this.toggleInlineStyle}
        position={position}
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
          placeholder="Write something cool in me"
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
    {label: 'H1Icon', style: 'header-one'},
    {label: 'H2Icon', style: 'header-two'},
    {label: 'UnorderedListIcon', style: 'unordered-list-item'}
  ];

  const INLINE_STYLES = [
    {label: 'BoldIcon', style: 'BOLD'},
    {label: 'ItallicIcon', style: 'ITALIC'},
    {label: 'UnderlineIcon', style: 'UNDERLINE'}
  ];

  let style = {
    left: position.left,
    top: position.top,
    transform: 'translateY(-120%) translateX(-50%)'
  };

  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls" style={style}>
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggleBlock}
          style={type.style}
        />
      )}

      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggleInline}
          style={type.style}
        />
      )}
    </div>
  );
};

const renderIcon = (icon) => {
  const Comp = Icons[icon];

  if (Comp) {
    return <Comp className="RichEditor-styleButton__icon rootClass__icon--svg"/>;
  }
}

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
      {renderIcon(props.label)}
    </span>
  );
}


export default NoteEditor

const { string } = PropTypes;

NoteEditor.propTypes = {

}
