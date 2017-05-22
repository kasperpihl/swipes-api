import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';

import NoteEditor from 'components/note-editor/NoteEditor';
import './styles/external-note-view.scss';

class ExternalNoteView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    bindAll(this, ['setEditorState']);
  }
  componentWillMount() {
    this.loadNote();
  }
  componentDidMount() {
  }
  setEditorState(editorState) {
    if(!this.state.editorState) {
      this.setState({ editorState });
    }

  }
  onLinkClick(url) {
    if(typeof window.postMessage === 'function') {
      window.postMessage(JSON.stringify({
        action: 'url',
        value: url,
      }));
    }
  }
  loadNote() {
    const serData = {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        token: getURLParameter('token'),
        note_id: getURLParameter('note_id'),
        organization_id: getURLParameter('organization_id'),
      }),
    };
    fetch(`${location.origin}/v1/notes.get`, serData).then((r) => {
      if (r && r.ok) return r.json();
      return Promise.reject({ message: r.statusText, code: r.status });
    }).then((res) => {
      if (res && res.ok) {
        console.log('res', res);
        this.setState({ rawState: res.note.text } );
      } else {
        return Promise.reject({ message: res.error });
      }
    }).catch((e) => {
      console.log('err', e);
    });
  }
  render() {
    const { editorState } = this.state;
    let { rawState } = this.state;
    if(editorState) {
      rawState = undefined;
    }
    return (
      <div className="external-note-view">
        <NoteEditor
          delegate={this}
          editorState={editorState}
          rawState={rawState}
          readOnly
        />
      </div>
    )
  }
}

export default ExternalNoteView

// const { string } = PropTypes;

ExternalNoteView.propTypes = {};
