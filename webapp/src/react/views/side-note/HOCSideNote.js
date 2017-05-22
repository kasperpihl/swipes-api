import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import NoteEditor from 'components/note-editor/NoteEditor';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import {
  convertToRaw,
  EditorState,
} from 'draft-js';
import Button from 'Button';
import { timeAgo } from 'swipes-core-js/classes/time-utils';
import diff from 'classes/draft-util';

import { bindAll, debounce, randomString, setupLoading } from 'swipes-core-js/classes/utils';
import * as actions from 'actions';
import * as ca from 'swipes-core-js/actions';

import './styles/side-note';

const emptyState = convertToRaw(EditorState.createEmpty().getCurrentContent());
const maxWidth = 820;
/* global msgGen */

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
    bindAll(this, ['bouncedSaveNote', 'onBeforeUnload', 'onResolveConflict']);
    this.bouncedSaveNote = debounce(this.bouncedSaveNote, 3000);
    setupLoading(this);
  }
  componentDidMount() {
    window.addEventListener('beforeunload', this.onBeforeUnload);
  }
  componentWillReceiveProps(nextProps) {
    const { note } = this.props;
    const { note: nextNote } = nextProps;

    // Check that the save wasn't done by us
    if (nextNote !== note && nextNote.get('last_save_id') !== this.saveId) {
      // If this was an update made from the outside and I'm doing nothing!
      if (!this._needSave && !this._isSaving) {
        this.setState({ overrideRaw: nextNote.get('text').toJS() });
      }
    }
  }
  componentDidUpdate() {
    this.clearOverrideRaw();
  }

  componentWillUnmount() {
    this._unmounted = true;
    window.removeEventListener('beforeunload', this.onBeforeUnload);
    this.saveToCache();
  }
  onLinkClick(url) {
    const { browser, target } = this.props;
    browser(target, url);
  }
  onBeforeUnload() {
    const { editorState } = this.state;
    this.saveToCache(editorState);
  }
  onResolveConflict() {
    const { editorState } = this.state;
    const { serverOrg, note } = this.props;
    const rawText = convertToRaw(editorState.getCurrentContent());
    const diffObj = diff((serverOrg.get('text') || emptyState).toJS(), note.get('text').toJS(), rawText);
    this.setLoading('conflict');
    this.saveNote(diffObj.editorState, note.get('rev')).then((res) => {
      if (res && res.ok) {
        this.clearLoading('conflict');
        this.setState({ overrideRaw: diffObj.editorState });
      } else {
        this.clearLoading('conflict', '!Something went wrong');
      }
    });
  }
  setEditorState(editorState, reset) {
    if (reset) {
      this._content = undefined;
    }
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
  clearOverrideRaw() {
    if (this.state.overrideRaw) {
      this.setState({ overrideRaw: undefined });
    }
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
  saveNote(text, rev) {
    const {
      saveNote,
      id,
      organizationId,
    } = this.props;

    return new Promise((resolve) => {
      if (this._isSaving) {
        resolve();
      }

      // Setting the flags for handling internally
      this._isSaving = true;
      this._needSave = false;
      this.saveId = randomString(6);

      saveNote(id, organizationId, text, this.saveId, rev).then((res) => {
        resolve(res);
        this._isSaving = false;

        if (res && res.ok) {
          window.analytics.sendEvent('Note edited', {});
          this.overrideRev = undefined;
        }
        if (!res || !res.ok) {
          this._needSave = true;
        }
      });
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
    const { target, note, latestRev, title } = this.props;
    const name = msgGen.users.getName(note.get('updated_by'), { yourself: true });
    const timeString = timeAgo(note.get('updated_at'));
    let subtitle = `Updated by ${name} ${timeString}`;
    let buttonHtml;
    if (latestRev < (note.get('rev') || 1)) {
      subtitle = `CONFLICT. Updated by ${name} ${timeString}`;
      buttonHtml = (
        <Button
          primary
          {...this.getLoading('conflict')}
          text="Resolve now"
          onClick={this.onResolveConflict}
        />
      );
    }

    return (
      <div className="side-note__header">
        <HOCHeaderTitle
          title={title}
          target={target}
          subtitle={subtitle}
        >
          {buttonHtml}
        </HOCHeaderTitle>
      </div>
    );
  }

  render() {
    const { note, cachedText } = this.props;
    const { editorState, overrideRaw } = this.state;
    if (!editorState && !note) {
      return null;
    }

    let rawState = overrideRaw;
    if (!editorState) {
      rawState = cachedText ||
                  note.get('text') ||
                  fromJS(emptyState);
      rawState = rawState.toJS();
    }

    return (
      <SWView header={this.renderHeader()} maxWidth={maxWidth}>
        <div className="side-note">
          <NoteEditor
            mediumEditor
            rawState={rawState}
            ref="editor"
            editorState={editorState}
            onBlur={this.onBlur}
            delegate={this}
            disabled={this.getLoading('conflict').loading}
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
  title: string,
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
  const latestRev = serverOrg.get('rev') || 1;

  return {
    organizationId: state.getIn(['me', 'organizations', 0, 'id']),
    note,
    latestRev,
    serverOrg,
    cachedText,
  };
}

export default connect(mapStateToProps, {
  saveNote: ca.notes.save,
  cacheNote: ca.notes.cache,
  browser: actions.main.browser,
})(HOCSideNote);
