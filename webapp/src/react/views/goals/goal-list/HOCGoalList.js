import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from 'actions';
import GoalList from './GoalList';


class HOCGoalList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  goalListClickedGoal(goalList, goalId) {
    const {
      navPush,
      goals,
    } = this.props;
    navPush({
      component: 'GoalOverview',
      title: goals.get(goalId).get('title'),
      props: {
        goal: goals.get(goalId),
      },
    });
  }
  render() {
    const { goals, me } = this.props;
    return (
      <GoalList me={me} goals={goals} delegate={this} />
    );
  }
}

function mapStateToProps(state) {
  const users = state.get('users');
  let goalsState = state.get('goals');

  if (goalsState) {
    goalsState = goalsState.map(g => g.updateIn(['steps'], steps => steps.map((s) => {
      const assignees = s.get('assignees');
      return s.set('assignees', assignees.map(userId => users.get(userId)));
    })));
  }

  return {
    goals: goalsState,
    users,
    me: state.get('me'),
  };
}

import { map, mapContains, list, listOf } from 'react-immutable-proptypes';
const { string } = PropTypes;
HOCGoalList.propTypes = {
  // removeThis: PropTypes.string.isRequired
};

const ConnectedHOCGoalList = connect(mapStateToProps, {
  navPush: actions.navigation.push,
})(HOCGoalList);
export default ConnectedHOCGoalList;
