import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as ca from 'swipes-core-js/actions';
import {
  Editor,
  getDefaultKeyBinding,
  getVisibleSelectionRect,
} from 'draft-js';
import getTriggerIndexInSelection from 'src/utils/draft-js/getTriggerIndexInSelection';
import insertMentionInSelection from 'src/utils/draft-js/insertMentionInSelection';
import clearSearchInSelection from 'src/utils/draft-js/clearSearchInSelection';
import getTextToSearchInSelection from 'src/utils/draft-js/getTextToSearchInSelection';
import setupDraftExtensions from 'src/utils/draft-js/setupDraftExtensions';
import Mention from './Mention';

@connect(state => ({
  results: state.getIn(['autoComplete', 'results']),
  string: state.getIn(['autoComplete', 'string']),
}), {
  search: ca.autoComplete.search,
  clear: ca.autoComplete.clear,
})
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.plugins = setupDraftExtensions(this, {
      decorators: [
        Mention,
      ],
    });
    this.state = {
      editorState: this.plugins.createEditorState(props.initialValue)
    };
    this.onChange = this.setEditorState;
    if(props.autoFocus) {
      this.shouldFocus = true;
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.reset && nextProps.reset !== this.props.reset) {
      this.setState({
        editorState: this.plugins.createEditorState(nextProps.initialValue)
      });
      if(nextProps.autoFocus) {
        this.shouldFocus = true;
      }
    }
  }
  componentDidMount() {
    this.handleFocus();
  }
  componentDidUpdate() {
    this.handleFocus();
  }
  handleFocus() {
    if(this.shouldFocus) {
      this.inputRef.blur();
      this.inputRef.focus();
      this.shouldFocus = false;
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
    
    if(this.props.clearMentions) {
      editorState = clearSearchInSelection(editorState, '@')
    } else {
      editorState = insertMentionInSelection(editorState, '@', item.id); 
    }

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
  }
  onEscape() {
    this.inputRef.blur();
  }
  onBlur() {
    this.props.clear();
  }
  keyBindingFn(e) {
    return getDefaultKeyBinding(e);
  }
  render() {
    const {
      innerRef,
      placeholder,
    } = this.props;
    return (
      <Editor
        ref={(c) => {
          this.inputRef = c;
          if(typeof innerRef === 'function') innerRef(c);
        }}
        editorState={this.state.editorState}
        placeholder={placeholder}
        {...this.plugins.bind}
      />
    );
  }
}
