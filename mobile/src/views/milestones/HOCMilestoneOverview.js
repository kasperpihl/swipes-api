import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { List } from 'immutable';
import ImmutableListView from 'react-native-immutable-list-view';
import HOCHeader from '../../components/header/HOCHeader';
import HOCGoalItem from '../goallist/HOCGoalItem';
import EmptyListFooter from '../../components/empty-list-footer/EmptyListFooter';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import { colors } from '../../utils/globalStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  list: {
    flex: 1,
  },
});

class HOCMilestoneOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: ['Current', 'Completed'],
      tabIndex: 0,
      goals: this.getFilteredGoals(this.props.milestone, this.props.starredGoals),
    };

    this.renderGoal = this.renderGoal.bind(this);
  }
  getFilteredGoals(milestone, starredGoals) {
    const goals = msgGen.milestones.getGoals(milestone);
    let gg = goals.sort((g1, g2) => {
      const g1StarI = starredGoals.indexOf(g1.get('id'));
      const g2StarI = starredGoals.indexOf(g2.get('id'));
      if (g1StarI > g2StarI) {
        return -1;
      }
      if (g2StarI > g1StarI) {
        return 1;
      }
      return 0;
    }).groupBy(g => new GoalsUtil(g).getIsCompleted() ? 'Completed' : 'Current');

    // Make sure there if no current or completed to add an empty list
    gg = gg.set('Current', gg.get('Current') || List());
    gg = gg.set('Completed', gg.get('Completed') || List());
    return gg;
  }
  onChangeTab(index) {
    if (index !== this.state.tabIndex) {
      this.setState({ tabIndex: index });
    }
  }
  onPushStack(goalOverview) {
    const { navPush } = this.props;

    navPush(goalOverview);
  }
  renderHeader() {
    const { tabIndex, tabs } = this.state;
    const { milestone } = this.props;

    return (
      <HOCHeader
        title={milestone.get('title')}
        currentTab={tabIndex}
        delegate={this}
        tabs={tabs}
      />
    );
  }
  renderGoal(goal) {
    return <HOCGoalItem goalId={goal.get('id')} delegate={this} />;
  }
  renderFooter() {
    return <EmptyListFooter />;
  }
  renderList() {
    const { tabs, tabIndex, goals } = this.state;
    const tab = tabs[tabIndex];
    const goalList = goals.get(tab);

    return (
      <ImmutableListView
        style={styles.list}
        immutableData={goalList}
        renderRow={this.renderGoal}
        renderFooter={this.renderFooter}
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderList()}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    starredGoals: state.getIn(['me', 'settings', 'starred_goals']),
  };
}

export default connect(mapStateToProps, {

})(HOCMilestoneOverview);
