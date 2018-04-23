import React, { Component } from 'react';
import { styleElement, styleSheet } from 'react-swiss';

const styles = styleSheet('Mention', {
  Text: {
    background: 'rgba($blue, 0.2)',
  }
})

const Text = styleElement('span', styles.Text);

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
      <Text>
        {children}
      </Text>
    );
  }
}

export default Mention;
