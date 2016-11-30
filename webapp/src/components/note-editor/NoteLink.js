import React, { Component, PropTypes } from 'react'

class NoteLink extends Component {
  static findLinkEntities(contentBlock, callback, contentState){
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
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    const { editorState } = this.props;
    const contentState = editorState.getCurrentContent();
    const {url} = contentState.getEntity(props.entityKey).getData();

    return (
      <a href={url}>
        {props.children}
      </a>
    )
  }
}

export default NoteLink

const { string } = PropTypes;
