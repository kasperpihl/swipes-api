import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../components/header/Header';
import { viewSize, colors } from '../../utils/globalStyles';

class HOCGoalList extends Component {
  constructor(props) {
    super(props)
  }
  renderHeader() {

    return <Header title="Goal list" />
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
    backgroundColor: colors.bgColor
  },
});

export default HOCGoalList;
