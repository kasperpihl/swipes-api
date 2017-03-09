import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import NoteEditor from 'components/note-editor/NoteEditor';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
} from 'draft-js';
import diff from 'classes/draft-util';

import { bindAll, debounce, randomString } from 'classes/utils';
import * as actions from 'actions';

import './styles/side-note';

const maxWidth = 820;

class HOCSideNote extends PureComponent {
  static maxWidth() {
    return maxWidth;
  }
  static fullscreen() {
    return true;
  }
  constructor(props) {
    super(props);
    this.state = {};
    bindAll(this, ['setEditorState', 'bouncedSaveNote', 'saveToCache']);
    this.bouncedSaveNote = debounce(this.bouncedSaveNote, 3000);
  }
  componentDidMount() {
    window.addEventListener('beforeunload', this.saveToCache);
  }
  componentWillReceiveProps(nextProps) {
    const { editorState } = this.state;
    const { note } = this.props;
    const { latestRev, note: nextNote, serverOrg } = nextProps;

    // Check that the save wasn't done by us
    if (nextNote !== note && nextNote.get('last_save_id') !== this.saveId) {
      let newContentState;

      // If this was an update made from the outside and I'm doing nothing!
      if (!this._needSave && !this._isSaving) {
        console.log('REPLACE. someone else saved this, and you have made no changes');
        newContentState = convertFromRaw(nextNote.get('text'));
      }
      if (this._needSave) {
        console.log('MERGING');
        const rawText = convertToRaw(editorState.getCurrentContent());
        const diffObj = diff(serverOrg.get('text'), nextNote.get('text'), rawText);
        newContentState = diffObj.editorState;
      }
      if (newContentState) {
        this.setEditorState(EditorState.push(
          editorState,
          newContentState,
          'replace-state',
        ));
      }
    }
    console.log('note update', nextNote.get('rev'), latestRev);
  }
  componentWillUnmount() {
    this._unmounted = true;
    window.removeEventListener('beforeunload', this.saveToCache);
    this.saveToCache();
  }
  onLinkClick(url) {
    const { browser, target } = this.props;
    browser(target, url);
  }
  setEditorState(editorState) {
    const content = editorState.getCurrentContent();
    if (this._content && content !== this._content) {
      if (!this._needSave) {
        this.saveToCache(editorState, true); // Force caching
      }
      this._needSave = true;
      this.bouncedSaveNote();
    }
    this.setState({ editorState });
    this._content = content;
  }
  saveToCache(editorState, force) {
    const { cacheNote, note } = this.props;
    if (!editorState) {
      editorState = this.state.editorState;
    }

    if (editorState && (this._needSave || force)) {
      cacheNote(note.get('id'), convertToRaw(editorState.getCurrentContent()));
    }

    if (editorState && this._needSave) {
      const text = convertToRaw(editorState.getCurrentContent());
      this.saveNote(text);
    }
  }
  saveNote(text) {
    const {
      saveNote,
      id,
      organizationId,
    } = this.props;

    if (this._isSaving) {
      return;
    }

    // Setting the flags for handling internally
    this._isSaving = true;
    this._needSave = false;
    this.saveId = randomString(6);

    saveNote(id, organizationId, text, '1234').then((res) => {
      this._isSaving = false;
      if (!res || !res.ok) {
        this._needSave = true;
      }
    });
  }
  bouncedSaveNote() {
    const { editorState } = this.state;
    if (this._needSave && !this._unmounted) {
      // Generating the data to save!
      const text = convertToRaw(editorState.getCurrentContent());

      this.saveNote(text);
    }
  }

  renderHeader() {
    const { target, note } = this.props;
    const subtitle = 'Me is cool';
    const title = note && note.get('title');
    return (
      <div className="side-note__header">
        <HOCHeaderTitle
          title={title}
          target={target}
          subtitle={subtitle}
        />
      </div>
    );
  }

  render() {
    const { note, cachedText } = this.props;
    const { editorState } = this.state;
    if (!editorState && !note) {
      return null;
    }
    let rawState;
    if (!editorState) {
      console.log(cachedText, note.get('text'));
      rawState = cachedText || note.get('text');
    }
    return (
      <SWView header={this.renderHeader()} maxWidth={maxWidth}>
        <div className="side-note">
          <NoteEditor
            rawState={rawState}
            ref="editor"
            editorState={editorState}
            setEditorState={this.setEditorState}
            onBlur={this.onBlur}
            delegate={this}
          />
        </div>
      </SWView>
    );
  }
}

const { string, func, object, number } = PropTypes;
HOCSideNote.propTypes = {
  note: map,
  serverOrg: map,
  latestRev: number,
  id: string,
  browser: func,
  organizationId: string,
  cacheNote: func,
  saveNote: func,
  cachedText: object,
  target: string,
};

function mapStateToProps(state, ownProps) {
  let cachedText = state.getIn(['notes', 'cache', ownProps.id, 'text']);
  if (!cachedText) {
    cachedText = state.getIn(['notes', 'cache', ownProps.id, '_savingText']);
  }

  const note = state.getIn(['notes', 'server', ownProps.id]);
  let serverOrg = state.getIn(['notes', 'cache', ownProps.id, 'serverOrg']);
  serverOrg = serverOrg || note;

  const latestRev = serverOrg.get('rev');

  return {
    organizationId: state.getIn(['me', 'organizations', 0, 'id']),
    note,
    latestRev,
    serverOrg,
    cachedText,
  };
}

export default connect(mapStateToProps, {
  saveNote: actions.notes.save,
  cacheNote: actions.notes.cache,
  browser: actions.main.browser,
})(HOCSideNote);
