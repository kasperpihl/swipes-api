import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import * as gs from 'styles';

const styles = StyleSheet.create({
  modal: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('center'),
  },
});

export default class LoadingModal extends PureComponent {
  render() {
    return (
      <View style={styles.modal}>
        <ActivityIndicator color={gs.colors.blue100} size="large" />
      </View>
    );
  }
}
