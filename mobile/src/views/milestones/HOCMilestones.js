import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import HOCHeader from '../../components/header/HOCHeader';
import { colors } from '../../utils/globalStyles';

class HOCMilestones extends PureComponent {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
});

export default HOCMilestones;
