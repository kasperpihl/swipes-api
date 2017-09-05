import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { viewSize } from '../../utils/globalStyles';

class EmptyListFooter extends PureComponent {
  render() {
    return <View style={styles.footer}></View>;
  }
}

const styles = StyleSheet.create({
  footer: {
    width: viewSize.width,
    height: 112,
  },
});

export default EmptyListFooter;
