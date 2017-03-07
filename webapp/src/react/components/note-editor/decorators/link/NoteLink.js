import React, { Component, PropTypes } from 'react';
import { Entity } from 'draft-js';
import './styles/link.scss';

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
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
    const { ctx } = this.props;
    // console.log(ctx.getEditorState);
  }
  render() {
    const { entityKey, children } = this.props;
    const { url } = Entity.get(entityKey).get('data');

    return (
      <a className="DraftEditor-link" href={url} onClick={this.onClick} rel="noreferrer noopener">
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
