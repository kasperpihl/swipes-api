import React, { PureComponent } from 'react';
import loadPage from 'src/react/pages/load';
import urlGetParameter from 'src/utils/url/urlGetParameter';
import NoteEditor from 'src/react/components/note-editor/NoteEditor';
import SW from './ExternalNoteView.swiss';

class ExternalNoteView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    this.loadNote();
  }
  setEditorState = editorState => {
    if (!this.state.editorState) {
      this.setState({ editorState });
    }
  };
  onLinkClick(url) {
    if (typeof window.postMessage === 'function') {
      window.postMessage(
        JSON.stringify({
          action: 'url',
          value: url
        })
      );
    }
  }
  loadNote() {
    const serData = {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        token: urlGetParameter('token'),
        note_id: urlGetParameter('note_id'),
        organization_id: urlGetParameter('organization_id')
      })
    };
    fetch(`${location.origin}/v1/notes.get`, serData)
      .then(r => {
        if (r && r.ok) return r.json();
        return Promise.reject({ message: r.statusText, code: r.status });
      })
      .then(res => {
        if (res && res.ok) {
          this.setState({ rawState: res.note.text });
        } else {
          return Promise.reject({ message: res.error });
        }
      })
      .catch(e => {
        console.log('err', e);
      });
  }
  renderLoading() {
    const { rawState } = this.state;
    if (rawState) {
      return;
    }

    return <SW.Loading>Loading</SW.Loading>;
  }
  renderEditor() {
    const { editorState } = this.state;
    let { rawState } = this.state;
    if (editorState) {
      rawState = undefined;
    }

    return (
      <NoteEditor
        delegate={this}
        editorState={editorState}
        rawState={rawState}
        readOnly
      />
    );
  }
  render() {
    return (
      <SW.Wrapper>
        {this.renderLoading()}
        {this.renderEditor()}
      </SW.Wrapper>
    );
  }
}

loadPage(ExternalNoteView);
