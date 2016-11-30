import React, { Component, PropTypes } from 'react'

class NoteLink extends Component {
  static strategy(contentBlock, callback, contentState){
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'LINK'
        );
      },
      callback
    );
  }
  render() {
    const { editorState, entityKey, children } = this.props;
    const contentState = editorState.getCurrentContent();
    const { url } = contentState.getEntity(entityKey).getData();

    return (
      <a href={url}>
        {children}
      </a>
    )
  }
}

export default NoteLink

const { string } = PropTypes;
