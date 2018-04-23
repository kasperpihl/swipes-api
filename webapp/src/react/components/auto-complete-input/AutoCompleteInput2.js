import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { styleElement } from 'react-swiss';
import * as ca from 'swipes-core-js/actions';
import {
  Editor,
  getDefaultKeyBinding,
  EditorState,
  Modifier,
  getVisibleSelectionRect,
} from 'draft-js';
import DraftExt from 'src/react/components/note-editor/draft-ext';
import Mention from './Mention';
import styles from './AutoCompleteInput.swiss';

const Wrapper = styleElement('div', styles.Wrapper);

class Tester extends PureComponent {
  constructor(props) {
    super(props);
    
    this.plugins = DraftExt(this, {
      decorators: [
        Mention,
      ],
    });
    this.state = {
      editorState: this.plugins.getEditorStateWithDecorators(props.initialEditorState)
    };
    this.onChange = this.setEditorState;
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.reset && nextProps.reset !== this.props.reset) {
      this.setState({
        editorState: this.plugins.getEditorStateWithDecorators()
      });
    }
  }
  getEditorState() {
    return this.state.editorState;
  }
  setEditorState(editorState) {
    this.handleAutoComplete(editorState);
    this.setState({ editorState });
    if(this.props.onChange) {
      this.props.onChange(editorState);
    }
  }
  onAutoCompleteSelect(item, i) {
    let { editorState } = this.state;
    const displayName = msgGen.users.getFirstName(item.id);
    const apiString = `<!${item.id}|${displayName}>`;

    let contentState = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    
    selection = selection.set('anchorOffset', this.selStart);

    
    contentState = Modifier.replaceText(
      contentState,
      selection,
      displayName,
    );
    selection = selection.set('focusOffset', this.selStart + displayName.length);

    contentState = contentState.createEntity(
      'MENTION',
      'IMMUTABLE',
      {
        apiString,
      },
    );
    const entityKey = contentState.getLastCreatedEntityKey();

    contentState = Modifier.applyEntity(
      contentState,
      selection,
      entityKey,
    );

    editorState = EditorState.set(editorState, { currentContent: contentState });

    const targetO = selection.get('focusOffset');
    selection = selection.set('anchorOffset', targetO).set('focusOffset', targetO);
    editorState = EditorState.acceptSelection(editorState, selection);
    
    this.setEditorState(editorState);

    if(this.props.onAutoCompleteSelect){
      this.props.onAutoCompleteSelect(item);
    }
  }
  handleAutoComplete(editorState) {
    const { search, clear, string } = this.props;
    const contentState = editorState.getCurrentContent();
    const sel = editorState.getSelection();
    let didSearch = false;
    if(sel.get('anchorKey') === sel.get('focusKey') &&
      sel.get('anchorOffset') === sel.get('focusOffset')
      ) {
      const block = contentState.getBlockForKey(sel.get('anchorKey'));
      const textToIndex = block.get('text').substr(0, sel.get('anchorOffset'));
      const triggerIndex = textToIndex.lastIndexOf('@');
      if(triggerIndex > -1) {
        this.selStart = triggerIndex;
        const boundingRect = getVisibleSelectionRect(window);
        if(boundingRect) {
          const wh = window.outerHeight;
          didSearch = true;
          search(textToIndex.substr(triggerIndex + 1), {
            delegate: this,
            types: ['users'],
            boundingRect,
            identifier: `${sel.get('anchorKey')}-${triggerIndex}`,
            showOnTop: (wh - boundingRect.bottom) < boundingRect.top,
          });
        }
        
      }
    }
    if(!didSearch && string) {
      clear();
    }
  }
  handleReturn(e) {
    const { results } = this.props;
    if(results) {
      return 'handled';
    }
    if(this.props.onReturn) {
      return this.props.onReturn(e);
    }
  }
  onBlur() {
    this.props.clear();
  }
  keyBindingFn(e) {
    return getDefaultKeyBinding(e);
  }
  render() {
    const {
      wrapperRef,
      editorRef,
      className,
      placeholder,
    } = this.props;
    return (
      <Wrapper ref={wrapperRef} className={className}>
        <Editor
          ref={editorRef}
          editorState={this.state.editorState}
          placeholder={placeholder}
          {...this.plugins.bind}
        />
      </Wrapper>
    );
  }
}

export default connect(state => ({
  results: state.getIn(['autoComplete', 'results']),
  string: state.getIn(['autoComplete', 'string']),
}), {
  search: ca.autoComplete.search,
  clear: ca.autoComplete.clear,
})(Tester)