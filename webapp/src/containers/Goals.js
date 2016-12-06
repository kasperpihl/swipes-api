import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { map } from 'react-immutable-proptypes';
import { overlay, main, goals } from 'actions';
import { bindAll } from 'classes/utils';

import GoalStep from '../components/goals/GoalStep';
import GoalList from '../components/goals/GoalList';
// import { PlusIcon } from '../components/icons'

import '../components/goals/styles/goals.scss';

class Goals extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['setActiveGoal', 'clickedRoundButton']);
  }
  setActiveGoal(id) {
    const { setActiveGoal, setOverlay, goals: goalsProp } = this.props;

    const goal = goalsProp.get(id);
    if (goal) {
      setActiveGoal(id);
      setOverlay({
        title: goal.get('title'),
        onClose: () => {
          setActiveGoal(null);
        },
      });
    }
  }
  stepAction(step, action, data) {
    const { pushOverlay, popOverlay } = this.props;

    if (action === 'fullscreen') {
      pushOverlay(data);
    }
    if (action === 'popOverlay') {
      popOverlay();
    }
  }
  stepCache(step, data) {
    const { cacheSave, currentGoal } = this.props;
    if (currentGoal) {
      cacheSave(currentGoal.get('id'), data);
    }
  }
  stepSubmit(step, stepId, data, previousSteps, callback) {
    const { submit, currentGoal } = this.props;
    if (currentGoal) {
      submit(currentGoal.get('id'), stepId, data, previousSteps).then(() => {
        if (callback) {
          callback();
        }
      });
    }
  }
  clickedRoundButton() {
    const {
      setOverlay,
    } = this.props;

    setOverlay({ component: 'StartGoal', title: 'Start a Goal' });
  }

  renderList() {
    const { currentGoal, goals: goalsProps, me } = this.props;

    if (currentGoal) {
      return undefined;
    }

    return (
      <GoalList
        goals={goalsProps}
        me={me}
        setActiveGoal={this.setActiveGoal}
      />
    );
  }
  renderTimeline() {
    const { currentGoal, me, users, cachedData } = this.props;

    if (!currentGoal) {
      return undefined;
    }

    let cache;

    if (cachedData) {
      cache = cachedData.get(currentGoal.get('id'));
    }

    return (
      <GoalStep
        cache={cache}
        users={users}
        myId={me.get('id')}
        initialStepIndex={currentGoal.get('currentStepIndex')}
        goal={currentGoal}
        delegate={this}
      />
    );
  }
  render() {
    return (
      <div className="goals">

        {this.renderList()}
        {this.renderTimeline()}
      </div>
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
    currentGoal: goalsState.getIn([state.getIn(['main', 'activeGoal'])]),
    cachedData: state.getIn(['main', 'cache']),
    users,
    me: state.get('me'),
  };
}

const ConnectedGoals = connect(mapStateToProps, {
  setOverlay: overlay.set,
  cacheSave: main.cacheSave,
  pushOverlay: overlay.push,
  popOverlay: overlay.pop,
  goalDelete: goals.delete,
  submit: goals.submitStep,
  setActiveGoal: main.setActiveGoal,
})(Goals);

const { func } = PropTypes;

Goals.propTypes = {
  pushOverlay: func,
  popOverlay: func,
  cacheSave: func,
  currentGoal: map,
  submit: func,
  setActiveGoal: func,
  setOverlay: func,
  goals: map,
  me: map,
  users: map,
  cachedData: map,
};

export default ConnectedGoals;
