import React, { Component, PropTypes } from 'react'
import {
  Editor,
  EditorState,
  SelectionState,
  RichUtils,
  ContentState,
  ContentBlock,
  getVisibleSelectionRect,
  convertToRaw,
  CompositeDecorator,
  Modifier,
  Entity
} from 'draft-js'
import StyleControl from './StyleControl'
import NoteLink from './NoteLink'

import { bindAll } from '../../classes/utils'
import * as Icons from '../icons'

import './styles/note-editor.scss'

class NoteEditor extends Component {
  static decorator(Component){
    return {
      strategy: Component.strategy,
      component: Component,
      props: {
        'test': true
      }
    }
  }
  static getEmptyEditorState(){
    const decorators = [
      NoteLink
    ].map((d) => this.decorator(d));
    const decorator = new CompositeDecorator(decorators);
    return EditorState.createEmpty(decorator);
  }

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
  addLink(styleControl, urlValue) {
    const { editorState } = this.props;
    const entityKey = Entity.create(
      'LINK',
      'MUTABLE',
      {url: urlValue}
    );
    const contentState = editorState.getCurrentContent();
    const newContentState = Modifier.applyEntity(
      contentState,
      editorState.getSelection(),
      entityKey
    )
    let newEditorState = EditorState.set(editorState, { currentContent: newContentState });

    newEditorState = RichUtils.toggleLink(
      newEditorState,
      newEditorState.getSelection(),
      entityKey
    )
    this.props.onChange(newEditorState);
  }
  removeLink(styleControl) {
    const {editorState} = this.props;
    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      this.props.onChange(RichUtils.toggleLink(editorState, selection, null))
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
  toggleBlockType(styleControl, blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.props.editorState,
        blockType
      )
    );
  }
  toggleInlineStyle(styleControl, inlineStyle) {
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
  hideStyleControls(a) {
    let styleControl = this.state.styleControl;

    styleControl = {show: false};
    this.setState({ styleControl });

    setTimeout( () => {
      const { editor } = this.refs;
      const { editorState } = this.props;
      const selectionState = editorState.getSelection();
      let newKey = selectionState.get('focusKey');
      let newOffset = selectionState.get('focusOffset');

      if (selectionState.get('isBackward')) {
        newKey = selectionState.get('anchorKey');
        newOffset = selectionState.get('anchorOffset');
      }

      const newSelState = SelectionState.createEmpty().merge({
        anchorKey: newKey,
        anchorOffset: newOffset,
        focusKey: newKey,
        focusOffset: newOffset,
      })
      const newEditorState = EditorState.forceSelection(editorState, newSelState);

      editor.focus();
      this.onChange(newEditorState);
    }, 0);
  }
  renderStyleControls() {
    const { hasSelected, styleControl } = this.state;
    const { editorState } = this.props;

    if(!styleControl.show || !hasSelected){
      return;
    }

    const position = this.positionForStyleControls();

    const selectionState = editorState.getSelection();
    console.log('selectionState', )

    return (
      <StyleControl
        delegate={this}
        editorState={editorState}
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
    let urlInput;
    if (this.state.showURLInput) {
      urlInput =
        <div>
          <input
            onChange={this.onURLChange}
            ref="url"
            type="text"
            value={this.state.urlValue}
            onKeyDown={this.onLinkInputKeyDown}
          />
          <button onMouseDown={this.confirmLink}>
            Confirm
          </button>
        </div>;
    }
    return (
      <div ref="rooty" className="sw-text-editor"
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}>
        {this.renderStyleControls()}
        <Editor
          ref="editor"
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
