import React, { Component, PropTypes } from 'react';
import { Entity } from 'draft-js';

class NoteLink extends Component {
  static strategy(contentBlock, callback) {
    contentBlock.findEntityRanges(
      (character) => {
        const entity = character.getEntity();
        return (
          entity !== null &&
          Entity.get(entity).get('type') === 'LINK'
        );
      },
      callback,
    );
  }
  render() {
    const { entityKey, children } = this.props;
    const { url } = Entity.get(entityKey).get('data');

    return (
      <a className="DraftEditor-link" href={url} target="_blank">
        {children}
      </a>
    );
  }
}

export default NoteLink;

const { string, arrayOf, object } = PropTypes;

NoteLink.propTypes = {
  entityKey: string,
  children: arrayOf(object),
};
