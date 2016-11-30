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
  static getEmptyEditorState(){
    const decorator = new CompositeDecorator([
      {
        strategy: NoteLink.strategy,
        component: NoteLink,
      },
    ]);
    return EditorState.createEmpty(decorator);
  }
  constructor(props) {
    super(props)

    this.state = {
      hasSelected: false,
      styleControl: {show: false},
      showURLInput: false,
      urlValue: ''
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
    this.promptForLink = this._promptForLink.bind(this);
    this.onURLChange = (e) => this.setState({urlValue: e.target.value});
    this.confirmLink = this._confirmLink.bind(this);
    this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
    this.removeLink = this._removeLink.bind(this);
  }
  _promptForLink(e) {
    e.preventDefault();
    const { editorState } = this.props;
    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      let url = '';
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }

      this.setState({
        showURLInput: true,
        urlValue: url,
      });
    }
  }
  _confirmLink(e) {
    e.preventDefault();
    const { editorState } = this.props;
    const { urlValue } = this.state;
    const entityKey = Entity.create(
      'LINK',
      'MUTABLE',
      {url: urlValue}
    );
    console.log('entityKey', entityKey);
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
    this.setState({
      showURLInput: false,
      urlValue: '',
    });
  }
  _onLinkInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmLink(e);
    }
  }
  _removeLink(e) {
    e.preventDefault();
    const {editorState} = this.props;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null),
      });
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
    if (true) {
      return;
    }
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
        <div style={{marginBottom: 10}}>
                Select some text, then use the buttons to add or remove links
                on the selected text.
              </div>
              <div >
                <button
                  onMouseDown={this.promptForLink}
                  style={{marginRight: 10}}>
                  Add Link
                </button>
                <button onMouseDown={this.removeLink}>
                  Remove Link
                </button>
              </div>
              {urlInput}
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
