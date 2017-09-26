import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, viewSize } from 'globalStyles';

export default class LoadingModal extends PureComponent {
  render() {
    return (
      <View style={styles.modal}>
        <ActivityIndicator color={colors.blue100} size="large" />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  modal: {
    width: viewSize.width * .5,
    height: viewSize.height * .5,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
