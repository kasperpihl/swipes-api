import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import {
  convertFromRaw,
  EditorState,
  convertToRaw,
} from 'draft-js';

import SwipesCard from 'components/swipes-card/SwipesCard';
import NoteEditor from 'components/note-editor/NoteEditor';

import './styles/note.scss';

class Note extends Component {
  static fullscreen() {
    return true;
  }
  static saveData(data) {
    return data.set('editorState', convertToRaw(data.get('editorState').getCurrentContent()));
  }
  static parseInitialData(data) {
    let editorState = NoteEditor.getEmptyEditorState();
    if (data && data.get('editorState')) {
      const raw = JSON.parse(JSON.stringify(data.get('editorState').toJS()));
      editorState = EditorState.push(editorState, convertFromRaw(raw));
    }

    return data.set('editorState', editorState);
  }
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      topPadding: 0,
    };
    this.onChange = this.onChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
  }
  componentDidMount() {
    setTimeout(() => {
      this.paddingForContainer();
    }, 1);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });
  }
  componentDidUpdate() {
    this.paddingForContainer();
  }
  onCardClick() {
    const { delegate } = this.props;
    delegate('fullscreen');
  }
  onChange(editorState) {
    const { delegate } = this.props;
    const { data } = this.state;

    delegate('change', data.set('editorState', editorState));
  }
  onTitleChange(e) {
    const { delegate } = this.props;
    const { data } = this.state;

    delegate('change', data.set('title', e.target.value));
  }
  paddingForContainer() {
    const { paddingTop } = this.state;
    const { settings } = this.props;
    let padding = 0;

    if (settings.get('fullscreen')) {
      const nH = this.refs.editor.refs.rooty.querySelector('.public-DraftEditor-content').firstChild.clientHeight;
      const tH = 250;
      const cH = this.refs.container.clientHeight;

      padding = (Math.max(cH - (nH + tH), 0)) / 2;
    }

    if (padding !== paddingTop) {
      this.setState({ paddingTop: padding });
    }
  }
  renderNoteCard() {
    const { settings } = this.props;

    if (settings.get('fullscreen')) {
      return undefined;
    }

    const { data } = this.state;

    return (
      <div className="sw-note-field__card">
        <SwipesCard
          delegate={this} data={{
            title: data.get('title') || 'Untitled note',
            description: data.get('editorState').getCurrentContent().getPlainText().substr(0, 100),
          }}
        />
      </div>
    );
  }
  renderNoteEditor() {
    const { settings } = this.props;

    if (!settings.get('fullscreen')) {
      return undefined;
    }

    const { data, paddingTop, noteFocus } = this.state;
    const styles = { paddingTop };

    return (
      <div className="sw-note-field__note-editor">
        <div className="sw-note-field__note" style={styles}>
          <input
            type="text"
            ref={(c) => { this._noteInput = c; }}
            className="sw-note-field__title"
            placeholder="Untitled note"
            disabled={!settings.get('editable')}
            value={data.get('title') || ''}
            onChange={this.onTitleChange}
            autoFocus
          />
          <NoteEditor
            ref="editor"
            readOnly={settings.get('editable') !== true}
            editorState={data.get('editorState')}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
  render() {
    return (
      <div ref="container" className="sw-note-field">
        {this.renderNoteEditor()}
        {this.renderNoteCard()}
      </div>
    );
  }
}
export default Note;

const { func } = PropTypes;

Note.propTypes = {
  data: map,
  delegate: func,
  settings: map,
};
