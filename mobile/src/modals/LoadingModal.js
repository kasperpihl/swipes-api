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
    width: viewSize.width,
    height: viewSize.height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    position: 'absolute',
    left: 0,
    top: 0,
  },
});