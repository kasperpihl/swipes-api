import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../components/header/Header';
import { viewSize, colors } from '../../utils/globalStyles';
import HOCGoalItem from './HOCGoalItem';

class HOCGoalList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabs: ['current', 'upcoming', 'unstarted'],
      tabIndex: 0,
    };
  }
  renderHeader() {
    return <Header title="Goal list" />
  }
  renderGoals() {
    const { filters } = this.props;
    const { tabIndex, tabs } = this.state;
    const goals = filters.getIn(['filters', tabs[tabIndex], 'goals']);
    return goals.map((gId) => (
      <HOCGoalItem
        key={gId}
        goalId={gId}
        filterId={tabs[tabIndex]}
      />;
    ))
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderGoals()}
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
function mapStateToProps(state) {
  return {
    filters: state.get('filters'),
  }
}

export default connect(mapStateToProps, {

})(HOCGoalList);
