import React, { Component, PropTypes } from 'react'
import { Entity } from 'draft-js'
import * as Icons from '../icons'

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
  renderIcon(icon){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="DraftEditor-link__icon"/>;
    }
  }
  render() {
    const { entityKey, children } = this.props;
    const { url } = Entity.get(entityKey).get('data');

    return (
      <a className="DraftEditor-link" href={url}>
        {children}
      </a>
    )
  }
}

export default NoteLink

const { string } = PropTypes;
