import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import NoteEditor from 'components/note-editor/NoteEditor';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import {
  convertToRaw,
} from 'draft-js';

import { bindAll, debounce } from 'classes/utils';
import * as actions from 'actions';

import './styles/side-note';

const maxWidth = 740;

class HOCSideNote extends PureComponent {
  static maxWidth() {
    return maxWidth;
  }
  static fullscreen() {
    return true;
  }
  constructor(props) {
    super(props);
    // editorState = EditorState.push(editorState, convertFromRaw(raw));
    this.state = { hasChanged: false };

    if (props.note) {
      this.state.serverNote = props.note.toJS();
    }
    bindAll(this, ['setEditorState', 'bouncedSaveNote', 'onBlur']);
    this.bouncedSaveNote = debounce(this.bouncedSaveNote, 3000);
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.note !== this.props.note) {
      console.log('new note', this.props.note.toJS());
    }
  }

  setEditorState(editorState) {
    const { hasChanged } = this.state;
    const newState = { editorState };
    if (!hasChanged && editorState.getUndoStack().first()) {
      newState.hasChanged = true;
    }
    this.setState(newState);
    this.bouncedSaveNote();
  }

  saveNote(editorState) {
    const {
      saveNote,
      id,
      organizationId,
    } = this.props;
    const { serverNote } = this.state;
    console.log(serverNote);
    saveNote(organizationId, id, convertToRaw(editorState.getCurrentContent()), serverNote.rev);
  }
  bouncedSaveNote() {
    const { editorState } = this.state;
    this.saveNote(editorState);
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
    const { editorState, serverNote } = this.state;
    if (!editorState && !serverNote) {
      return null;
    }

    const rawState = editorState ? undefined : serverNote.text;

    return (
      <SWView header={this.renderHeader()} maxWidth={maxWidth}>
        <div className="side-note">
          <NoteEditor
            rawState={rawState}
            ref="editor"
            editorState={editorState}
            setEditorState={this.setEditorState}
            onBlur={this.onBlur}
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
})(HOCSideNote);
