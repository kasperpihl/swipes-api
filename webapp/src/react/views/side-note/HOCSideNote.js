import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import NoteEditor from 'components/note-editor/NoteEditor';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import {
  convertToRaw,
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
  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.saveToCache);
    this.saveToCache();
  }
  componentDidMount() {
    window.addEventListener('beforeunload', this.saveToCache);
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.note !== this.props.note) {
      if (this._saveId !== nextProps.note.get('last_save_id')) {
      }
      console.log(this._saveId, nextProps.note.get('last_save_id'));
    }
  }
  onLinkClick(url) {
    const { browser, target } = this.props;
    browser(target, url);
  }
  setEditorState(editorState) {
    const content = editorState.getCurrentContent();
    if (this._content && content !== this._content) {
      this._needSave = true;
      if (!this._isSaving) {

      }
      this.bouncedSaveNote();
    }
    this.setState({ editorState });
    this._lastContent = content;
  }
  saveToCache() {
    const { editorState } = this.state;
    if (this._needSave) {
      this.saveNote(editorState);
    }
  }
  saveNote(editorState, rev) {
    if (this._isSaving) {
      return;
    }
    this._needSave = false;
    const {
      saveNote,
      id,
      organizationId,
    } = this.props;
    const raw = convertToRaw(editorState.getCurrentContent());
    this._isSaving = true;
    this._saveId = randomString(6);
    saveNote(organizationId, id, raw, rev, this._saveId).then((res) => {
      this._isSaving = false;
      if (!res || !res.ok) {
        this._needSave = true;
        if (res.error && res.error.message === 'merge_needed') {

        }
      }
      console.log('res', res);
    });
  }
  bouncedSaveNote() {
    const { editorState } = this.state;
    const { note } = this.props;
    this.saveNote(editorState, note.get('rev'));
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
    const { note } = this.props;
    const { editorState } = this.state;
    if (!editorState && !note) {
      return null;
    }

    const rawState = editorState ? undefined : note.toJS().text;

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

const { string, func } = PropTypes;
HOCSideNote.propTypes = {
  note: map,
  id: string,
  browser: func,
  organizationId: string,
  saveNote: func,
  target: string,
};

function mapStateToProps(state, ownProps) {
  return {
    organizationId: state.getIn(['me', 'organizations', 0, 'id']),
    note: state.getIn(['notes', ownProps.id]),
  };
}

export default connect(mapStateToProps, {
  saveNote: actions.main.note.save,
  browser: actions.main.browser,
})(HOCSideNote);
