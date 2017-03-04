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
  static handleBeforeInput(ctx, str) {
    const editorState = ctx.getEditorState();
    const selection = editorState.getSelection();
    const currentBlock = editorState.getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const blockType = currentBlock.getType();
    const blockLength = currentBlock.getLength();

    if (str === '`' && blockType === 'unstyled') {
      if (blockLength === 2 && currentBlock.getText() === '``') {
        ctx.setEditorState(resetBlockToType(editorState, 'code-block'));
        return true;
      }
    }

    return false;
  }
  static handleKeyCommand(ctx, command) {
    const editorState = ctx.getEditorState();
    if (CodeUtils.hasSelectionInBlock(editorState)) {
      const newState = CodeUtils.handleKeyCommand(editorState, command);
      if (newState) {
        ctx.setEditorState(newState);
        return true;
      }
    }
    return false;
  }
  static keyBindingFn(ctx, e) {
    const editorState = ctx.getEditorState();
    if (CodeUtils.hasSelectionInBlock(editorState)) {
      return CodeUtils.getKeyBinding(e);
    }
    return false;
  }

  static handleReturn(ctx, e) {
    const editorState = ctx.getEditorState();
    if (CodeUtils.hasSelectionInBlock(editorState)) {
      ctx.setEditorState(CodeUtils.handleReturn(e, editorState));
      return true;
    }
    return false;
  }
  static onTab(ctx, e) {
    const editorState = ctx.getEditorState();
    if (CodeUtils.hasSelectionInBlock(editorState)) {
      ctx.setEditorState(CodeUtils.handleTab(e, editorState));
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
