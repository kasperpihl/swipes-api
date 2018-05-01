import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { styleElement } from 'react-swiss';
import * as ca from 'swipes-core-js/actions';
import {
  Editor,
  getDefaultKeyBinding,
  getVisibleSelectionRect,
} from 'draft-js';
import getTriggerIndexInSelection from 'src/utils/draft-js/getTriggerIndexInSelection';
import insertMentionInSelection from 'src/utils/draft-js/insertMentionInSelection';
import getTextToSearchInSelection from 'src/utils/draft-js/getTextToSearchInSelection';
import DraftExt from 'src/react/components/note-editor/draft-ext';
import Mention from './Mention';
import styles from './AutoCompleteInput.swiss';

const Wrapper = styleElement('div', styles.Wrapper);

class AutoCompleteInput extends PureComponent {
  constructor(props) {
    super(props);
    
    this.plugins = DraftExt(this, {
      decorators: [
        Mention,
      ],
    });
    this.state = {
      editorState: this.plugins.createEditorState(props.initialValue)
    };
    this.onChange = this.setEditorState;
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.reset && nextProps.reset !== this.props.reset) {
      this.setState({
        editorState: this.plugins.createEditorState(nextProps.initialValue)
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
    
    editorState = insertMentionInSelection(editorState, '@', item.id);

    this.setEditorState(editorState);

    if(this.props.onAutoCompleteSelect){
      this.props.onAutoCompleteSelect(item);
    }
  }
  handleAutoComplete(editorState) {
    const { search, clear, string } = this.props;
    const triggerIndex = getTriggerIndexInSelection(editorState, '@');
    let didSearch = false;
    if(triggerIndex > -1) {
      const boundingRect = getVisibleSelectionRect(window);
      if(boundingRect) {
        const wh = window.outerHeight;
        didSearch = true;
        const contentState = editorState.getCurrentContent();
        const sel = editorState.getSelection();
        search(getTextToSearchInSelection(editorState, '@'), {
          delegate: this,
          types: ['users'],
          boundingRect,
          identifier: `${sel.get('anchorKey')}-${triggerIndex}`,
          showOnTop: (wh - boundingRect.bottom) < boundingRect.top,
        });
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
})(AutoCompleteInput)