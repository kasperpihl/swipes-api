import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { viewSize } from 'globalStyles';

class EmptyListFooter extends PureComponent {
  render() {
    return <View style={styles.footer} />;
  }
}

const styles = StyleSheet.create({
  footer: {
    width: viewSize.width,
    height: 112,
  },
});

export default EmptyListFooter;
