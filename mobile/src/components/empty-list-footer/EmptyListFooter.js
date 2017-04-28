import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { viewSize } from '../../utils/globalStyles';

class EmptyListFooter extends Component {
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
