import React, { Component, PropTypes } from 'react'
import { Entity } from 'draft-js'
class NoteLink extends Component {
  static strategy(contentBlock, callback){
    contentBlock.findEntityRanges(
      (character) => {
        const entity = character.getEntity();
        return (
          entity !== null &&
          Entity.get(entity).get('type') === 'LINK'
        );
      },
      callback
    );
  }
  render() {
    console.log(this.props);
    const { entityKey, children } = this.props;
    const { url } = Entity.get(entityKey).get('data');

    return (
      <a href={url}>
        {children}
      </a>
    )
  }
}

export default NoteLink

const { string } = PropTypes;
