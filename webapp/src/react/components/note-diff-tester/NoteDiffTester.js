import React, { PureComponent } from 'react';
import { styleElement } from 'swiss-react';
import { setupCachedCallback, bindAll } from 'swipes-core-js/classes/utils';
import getDiffServerClient from 'src/utils/draft-js/getDiffServerClient';
import Button from 'src/react/components/button/Button';
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
} from 'draft-js';
import NoteEditor from './NoteEditor';

import styles from './NodeDiffTester.js';

const Wrapper = styleElement('div', styles.Wrapper);
const Note = styleElement('div', styles.Note);
const Middle = styleElement('div', styles.Middle);

class NoteDiffTester extends PureComponent {
  constructor(props) {
    super(props);
    const editorState = NoteEditor.getEmptyEditorState();
    this.state = this.getDefaultState(editorState);
    this.onStateCached = setupCachedCallback(this.onState, this);
    bindAll(this, ['onOriginalBlur', 'onDiff']);
  }
  onOriginalBlur() {
    this.setState(this.getDefaultState(this.state.serverOriginal));
  }
  onState(key, editorState) {
    this.setState({
      [key]: editorState,
    });
  }
  onDiff() {
    const serverOrg = convertToRaw(this.state.serverOriginal.getCurrentContent());
    const clientMod = convertToRaw(this.state.clientModified.getCurrentContent());
    const serverMod = convertToRaw(this.state.serverModified.getCurrentContent());

    const newState = getDiffServerClient(serverOrg, serverMod, clientMod);
    let editorState = NoteEditor.getEmptyEditorState();
    editorState = EditorState.push(editorState, convertFromRaw(newState));

    this.setState({ calculatedDiff: editorState });
    console.log('org', serverOrg);
    console.log('edited', newState);
  }
  getDefaultState(editorState) {
    return {
      serverOriginal: editorState,
      serverModified: editorState,
      clientModified: editorState,
      calculatedDiff: null,
    };
  }
  renderServerOriginal() {
    const { serverOriginal } = this.state;
    return (
      <NoteEditor
        onChange={this.onStateCached('serverOriginal')}
        onBlur={this.onOriginalBlur}
        editorState={serverOriginal}
      />
    );
  }
  renderClientModified() {
    const { clientModified } = this.state;
    return (
      <NoteEditor
        onChange={this.onStateCached('clientModified')}
        editorState={clientModified}
      />
    );
  }
  renderServerModified() {
    const { serverModified } = this.state;
    return (
      <NoteEditor
        onChange={this.onStateCached('serverModified')}
        editorState={serverModified}
      />
    );
  }
  renderCalculatedDiff() {
    const { calculatedDiff } = this.state;
    if (!calculatedDiff) {
      return (
        <Button
          title="Calculate Diff"
          onClick={this.onDiff}
        />
      );
    }
    return (
      <NoteEditor
        disabled
        onChange={this.onStateCached('calculatedDiff')}
        editorState={calculatedDiff}
      />
    );
  }
  render() {
    return (
      <Wrapper>
        <Note>
          {this.renderServerOriginal()}
        </Note>
        <Middle>
          <Note inMiddle>
            {this.renderServerModified()}
          </Note>
          <Note inMiddle>
            {this.renderClientModified()}
          </Note>
        </Middle>
        <Note>
          {this.renderCalculatedDiff()}
        </Note>
      </Wrapper>
    );
  }
}

export default NoteDiffTester;
