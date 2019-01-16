import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import NoteEditor from 'src/react/components/note-editor/NoteEditor';
import SWView from 'src/react/app/view-controller/SWView';
import HOCDiscussButton from 'src/react/components/discuss-button/HOCDiscussButton';
import CardHeader from 'src/react/components/CardHeader/CardHeader';
import TimeAgo from 'swipes-core-js/components/TimeAgo';
import { convertToRaw, EditorState } from 'draft-js';
import Button from 'src/react/components/button/Button';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import getDiffServerClient from 'src/utils/draft-js/getDiffServerClient';
import { setupLoading } from 'swipes-core-js/classes/utils';
import randomString from 'swipes-core-js/utils/randomString';
import debounce from 'swipes-core-js/utils/debounce';
import dayStringForDate from 'swipes-core-js/utils/time/dayStringForDate';
import * as mainActions from 'src/redux/main/mainActions';
import * as ca from 'swipes-core-js/actions';
import SW from './SideNote.swiss';

const emptyState = convertToRaw(EditorState.createEmpty().getCurrentContent());
const maxWidth = 820;
/* global msgGen */

const mapStateToProps = (state, props) => {
  let cachedText = state.notes.getIn(['cache', props.id, 'text']);
  if (!cachedText) {
    cachedText = state.notes.getIn(['cache', props.id, '_savingText']);
  }

  const note = state.notes.getIn(['server', props.id]);
  let serverOrg = state.notes.getIn(['cache', props.id, 'serverOrg']);
  serverOrg = serverOrg || note;
  const latestRev = serverOrg ? serverOrg.get('rev') : 1;

  return {
    organizationId: state.me.getIn(['organizations', 0, 'id']),
    note,
    latestRev,
    serverOrg,
    cachedText
  };
};

@navWrapper
@connect(
  mapStateToProps,
  {
    saveNote: ca.notes.save,
    cacheNote: ca.notes.cache,
    browser: mainActions.browser
  }
)
export default class SideNote extends PureComponent {
  static sizes() {
    return [600, 900];
  }
  static maxWidth() {
    return maxWidth;
  }
  static fullscreen() {
    return true;
  }
  constructor(props) {
    super(props);
    this.state = {};
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
  bouncedSaveNote = () => {
    const { editorState } = this.state;
    if (this._needSave && !this._unmounted) {
      // Generating the data to save!
      const text = convertToRaw(editorState.getCurrentContent());

      this.saveNote(text);
    }
  };
  onLinkClick(url) {
    const { browser, target } = this.props;
    browser(target, url);
  }
  onBeforeUnload = () => {
    const { editorState } = this.state;
    this.saveToCache(editorState);
  };
  onResolveConflict = () => {
    const { editorState } = this.state;
    const { serverOrg, note } = this.props;
    const rawText = convertToRaw(editorState.getCurrentContent());
    const diffObj = getDiffServerClient(
      (serverOrg.get('text') || emptyState).toJS(),
      note.get('text').toJS(),
      rawText
    );
    this.setLoading('conflict');
    this.saveNote(diffObj.editorState, note.get('rev')).then(res => {
      if (res && res.ok) {
        this.clearLoading('conflict');
        this.setState({ overrideRaw: diffObj.editorState });
      } else {
        this.clearLoading('conflict', '!Something went wrong');
      }
    });
  };
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
    const { saveNote, id, organizationId } = this.props;

    return new Promise(resolve => {
      if (this._isSaving) {
        resolve();
      }

      // Setting the flags for handling internally
      this._isSaving = true;
      this._needSave = false;
      this.saveId = randomString(6);

      saveNote(id, organizationId, text, this.saveId, rev).then(res => {
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

  renderHeader() {
    const { target, note, latestRev, title } = this.props;
    const name = msgGen.users.getName(note.get('updated_by'), {
      yourself: true
    });
    const subtitle = [
      `Updated by ${name} `,
      <TimeAgo key="ts" date={note.get('updated_at')} />
    ];
    let buttonHtml;
    if (latestRev < (note.get('rev') || 1)) {
      subtitle[0] = `CONFLICT. Updated by ${name} `;
      buttonHtml = (
        <Button
          {...this.getLoading('conflict')}
          title="Resolve now"
          onClick={this.onResolveConflict}
        />
      );
    }

    return (
      <SW.Header>
        <CardHeader title={title} target={target} subtitle={subtitle}>
          {buttonHtml}
          <HOCDiscussButton
            context={{
              id: note.get('id'),
              title
            }}
          />
        </CardHeader>
      </SW.Header>
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
      rawState = cachedText || note.get('text') || fromJS(emptyState);
      rawState = rawState.toJS();
    }

    return (
      <SWView header={this.renderHeader()} maxWidth={maxWidth}>
        <SW.Wrapper>
          <NoteEditor
            mediumEditor
            rawState={rawState}
            ref="editor"
            editorState={editorState}
            onBlur={this.onBlur}
            delegate={this}
            disabled={this.isLoading('conflict')}
          />
        </SW.Wrapper>
      </SWView>
    );
  }
}