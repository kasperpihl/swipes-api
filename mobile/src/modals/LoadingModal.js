import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import * as gs from 'styles';

const styles = StyleSheet.create({
  modal: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('column', 'center', 'center'),
    backgroundColor: 'transparent'
  },
  loadingLabel: {
    ...gs.mixins.padding(12, 0),
    ...gs.mixins.font(15, 'white')
  }
});

export default class LoadingModal extends PureComponent {
  render() {
    const { label } = this.props;

    return (
      <View style={styles.modal}>
        <ActivityIndicator color='white' size="large" />
        <Text style={styles.loadingLabel}>{label}</Text>
      </View>
    );
  }
}
