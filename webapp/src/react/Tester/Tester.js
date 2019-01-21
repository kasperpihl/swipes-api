import React, { PureComponent } from 'react';
import { styleSheet } from 'swiss-react';

const SW = styleSheet('Test', {
  Wrapper: {
    _flex: ['column', 'flex-start', 'flex-start']
  }
});

export default class Tester extends PureComponent {
  render() {
    return <SW.Wrapper />;
  }
}
