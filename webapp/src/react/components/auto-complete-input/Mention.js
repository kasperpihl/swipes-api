import React, { Component } from 'react';
import SW from './Mention.swiss';

class Mention extends Component {
  static strategy(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
      (character) => {
        const entity = character.getEntity();
        return (
          entity !== null &&
          contentState.getEntity(entity).get('type') === 'MENTION'
        );
      },
      callback,
    );
  }
  render() {
    const { children } = this.props;

    return (
      <SW.Text>
        {children}
      </SW.Text>
    );
  }
}

export default Mention;
