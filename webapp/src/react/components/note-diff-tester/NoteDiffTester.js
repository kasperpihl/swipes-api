import React, { PureComponent } from 'react';
import { setupCachedCallback } from 'swipes-core-js/classes/utils';
import getDiffServerClient from 'src/utils/draft-js/getDiffServerClient';
import Button from 'src/react/components/Button/Button';
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import NoteEditor from './NoteEditor';
import SW from './NodeDiffTester.js';

class NoteDiffTester extends PureComponent {
  constructor(props) {
    super(props);
    const editorState = NoteEditor.getEmptyEditorState();
    this.state = this.getDefaultState(editorState);
    this.onStateCached = setupCachedCallback(this.onState, this);
  }
  onOriginalBlur = () => {
    this.setState(this.getDefaultState(this.state.serverOriginal));
  };
  onState(key, editorState) {
    this.setState({
      [key]: editorState
    });
  }
  onDiff = () => {
    const serverOrg = convertToRaw(
      this.state.serverOriginal.getCurrentContent()
    );
    const clientMod = convertToRaw(
      this.state.clientModified.getCurrentContent()
    );
    const serverMod = convertToRaw(
      this.state.serverModified.getCurrentContent()
    );

    const newState = getDiffServerClient(serverOrg, serverMod, clientMod);
    let editorState = NoteEditor.getEmptyEditorState();
    editorState = EditorState.push(editorState, convertFromRaw(newState));

    this.setState({ calculatedDiff: editorState });
    console.log('org', serverOrg);
    console.log('edited', newState);
  };
  getDefaultState(editorState) {
    return {
      serverOriginal: editorState,
      serverModified: editorState,
      clientModified: editorState,
      calculatedDiff: null
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
      return <Button title="Calculate Diff" onClick={this.onDiff} />;
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
      <SW.Wrapper>
        <SW.Note>{this.renderServerOriginal()}</SW.Note>
        <SW.Middle>
          <SW.Note inMiddle>{this.renderServerModified()}</SW.Note>
          <SW.Note inMiddle>{this.renderClientModified()}</SW.Note>
        </SW.Middle>
        <SW.Note>{this.renderCalculatedDiff()}</SW.Note>
      </SW.Wrapper>
    );
  }
}

export default NoteDiffTester;
