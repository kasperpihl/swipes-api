import React, { PureComponent } from 'react';
import { setupCachedCallback, bindAll } from 'classes/utils';
import diff from 'classes/draft-util';
import Button from 'Button';
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
} from 'draft-js';
import NoteEditor from './NoteEditor';

import './styles/note-diff-tester.scss';
// now use events as onClick: this.onStateCached(i)
// import { map, list } from 'react-immutable-proptypes';

class NoteDiffTester extends PureComponent {
  constructor(props) {
    super(props);
    const editorState = NoteEditor.getEmptyEditorState();
    this.state = this.getDefaultState(editorState);
    this.onStateCached = setupCachedCallback(this.onState, this);
    bindAll(this, ['onOriginalBlur', 'onDiff']);
  }
  componentDidMount() {
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

    const newState = diff(serverOrg, serverMod, clientMod);
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
          text="Calculate Diff"
          primary
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
      <div className="note-diff">
        <div className="note-diff__note">
          {this.renderServerOriginal()}
        </div>
        <div className="note-diff__middle">
          <div className="note-diff__note">
            {this.renderServerModified()}
          </div>
          <div className="note-diff__note">
            {this.renderClientModified()}
          </div>
        </div>
        <div className="note-diff__note">
          {this.renderCalculatedDiff()}
        </div>
      </div>
    );
  }
}

export default NoteDiffTester;

// const { string } = PropTypes;

NoteDiffTester.propTypes = {};
