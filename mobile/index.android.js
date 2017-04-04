import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import Root from './src/Root';

export default class swipes extends Component {
  render() {
    return <Root />
  }
}

AppRegistry.registerComponent('swipes', () => swipes);
