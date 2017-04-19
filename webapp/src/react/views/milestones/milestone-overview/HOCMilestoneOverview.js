import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import { setupLoading } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import HOCGoalSelector from 'context-menus/goal-selector/HOCGoalSelector';
// import { map, list } from 'react-immutable-proptypes';
import { List } from 'immutable';

import MilestoneOverview from './MilestoneOverview';

class HOCMilestoneOverview extends PureComponent {
  static minWidth() {
    return 840;
  }
  static maxWidth() {
    return 900;
  }
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      tabs: ['Current', 'Completed'],
      goals: this.getFilteredGoals(props.milestone, props.starredGoals),
    };
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      goals: this.getFilteredGoals(nextProps.milestone, nextProps.starredGoals),
    })
  }
  onAddGoals(e) {
    const { contextMenu, milestone } = this.props;
    const options = this.getOptionsForE(e);
    contextMenu({
      component: HOCGoalSelector,
      options,
      props: {
        milestoneId: milestone.get('id'),
        delegate: this,
      },
    })
  }
  onGoalClick(goalId) {
    const { navPush } = this.props;
    window.analytics.sendEvent('Goal opened', {});
    navPush({
      id: 'GoalOverview',
      title: 'Goal overview',
      props: {
        goalId,
      },
    });
  }
  tabDidChange(index) {
    const { tabIndex } = this.state;
    if (tabIndex !== index) {
      this.setState({
        tabIndex: index,
      });
    }
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
    gg = gg.set('Current', gg.get('Current') || List())
    gg = gg.set('Completed', gg.get('Completed') || List());
    return gg;
  }
  getGoalListProps() {
    const { tabIndex, tabs } = this.state;
    return {
      delegate: this,
      tabIndex,
      tabs,
    }
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
      excludeY: true,
      positionY: 10,
    };
  }
  render() {
    const { milestone } = this.props;
    const { goals, tabs, tabIndex } = this.state;

    return (
      <MilestoneOverview
        milestone={milestone}
        tabs={tabs}
        goals={goals}
        tabIndex={tabIndex}
        delegate={this}
      />
    );
  }
}
// const { string } = PropTypes;

HOCMilestoneOverview.propTypes = {};

function mapStateToProps(state, ownProps) {
  return {
    goals: state.get('goals'),
    milestone: state.getIn(['milestones', ownProps.milestoneId]),
    starredGoals: state.getIn(['me', 'settings', 'starred_goals']),
  };
}

export default connect(mapStateToProps, {
  contextMenu: a.main.contextMenu,
})(HOCMilestoneOverview);
