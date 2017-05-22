import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import HOCHeader from '../../components/header/HOCHeader';
import { colors } from '../../utils/globalStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
});

class HOCMilestones extends PureComponent {
  pressThis() {
    console.log('wtf');
  }
  renderHeader() {
    return <HOCHeader title="Milestones" />;
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
      </View>
    );
  }
}

export default HOCMilestones;
