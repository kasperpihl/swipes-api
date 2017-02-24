import React, { PureComponent } from 'react';
import PrismDecorator from 'draft-js-prism';
import CodeUtils from 'draft-js-code';
import {
  resetBlockToType,
} from '../../draft-utils';

import './styles/index.scss';

// import { map, list } from 'react-immutable-proptypes';

class CodeBlock extends PureComponent {
  static getDecorator() {
    return new PrismDecorator();
  }
  static handleBeforeInput(editorState, onChange, str) {
    const selection = editorState.getSelection();
    const currentBlock = editorState.getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const blockType = currentBlock.getType();
    const blockLength = currentBlock.getLength();

    if (str === '`' && blockType === 'unstyled') {
      if (blockLength === 2 && currentBlock.getText() === '``') {
        onChange(resetBlockToType(editorState, 'code-block'));
        return true;
      }
    }

    return false;
  }
  static handleKeyCommand(editorState, onChange, command) {
    if (CodeUtils.hasSelectionInBlock(editorState)) {
      const newState = CodeUtils.handleKeyCommand(editorState, command);
      if (newState) {
        onChange(newState);
        return true;
      }
    }
    return false;
  }
  static keyBindingFn(editorState, onChange, e) {
    if (CodeUtils.hasSelectionInBlock(editorState)) {
      return CodeUtils.getKeyBinding(e);
    }
    return false;
  }

  static handleReturn(editorState, onChange, e) {
    if (CodeUtils.hasSelectionInBlock(editorState)) {
      onChange(CodeUtils.handleReturn(e, editorState));
      return true;
    }
    return false;
  }
  static onTab(editorState, onChange, e) {
    if (CodeUtils.hasSelectionInBlock(editorState)) {
      onChange(CodeUtils.handleTab(e, editorState));
      return true;
    }
    return false;
  }
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }
  render() {
    return (
      <div className="codeBlock" />
    );
  }
}

export default CodeBlock;

// const { string } = PropTypes;

CodeBlock.propTypes = {};
