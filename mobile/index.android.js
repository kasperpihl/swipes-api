import React, { PureComponent } from 'react';
import { AppRegistry } from 'react-native';
import Root from './src/Root';

export default class swipes extends PureComponent {
  render() {
    return <Root />;
  }
}

AppRegistry.registerComponent('swipes', () => swipes);
