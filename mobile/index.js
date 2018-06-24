import React, { PureComponent } from 'react';
import { AppRegistry, SafeAreaView } from 'react-native';
import Root from './src/Root';

export default class swipes extends PureComponent {
  render() {

    return (
      <SafeAreaView style={{flex: 1}}>
        <Root />
      </SafeAreaView>
    );
  }
}

AppRegistry.registerComponent('swipes', () => swipes);
