import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import { overlay, main, goals } from '../actions';
import { bindAll } from '../classes/utils'


import GoalStep from '../components/goals/GoalStep'
import GoalList from '../components/goals/GoalList'
import { PlusIcon } from '../components/icons'

import '../components/goals/styles/goals.scss';

class Goals extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['setActiveGoal', 'clickedRoundButton']);
  }
  stepAction(step, action, data) {
    const { pushOverlay, popOverlay } = this.props;

    if (action === 'fullscreen') {
      pushOverlay(data);
    }
    if(action === 'popOverlay') {
      popOverlay();
    }
  }
  stepCache(step, data){
    const { cacheSave, currentGoal } = this.props;
    if(currentGoal){
      cacheSave(currentGoal.get('id'), data);
    }

  }
  stepSubmit(step, goalId, stepId, data, previousSteps) {

    const { submit } = this.props;

    submit(goalId, stepId, data, previousSteps);
  }
  setActiveGoal(id){
    const { setActiveGoal, setOverlay, goals } = this.props;

    const goal = goals.get(id);
    if(goal){
      setActiveGoal(id);
      setOverlay({title: goal.get('title'), onClose: () => {
        setActiveGoal(null);
      }});
    }

  }
  clickedRoundButton() {
    const {
      setOverlay
    } = this.props;
    console.log('click!');
    setOverlay({component: 'StartGoal', title: 'Start a Goal'});
  }
  renderPlusButton(){
    const { currentGoal } = this.props;
    if(!currentGoal){
      let className = 'fab fab--add';
      let icon = <PlusIcon className="fab__icon"/>

      return (
        <div className={className} onClick={this.clickedRoundButton}>
          {icon}
        </div>
      )
    }

  }
  renderList() {
    const { currentGoal, goals, me } = this.props;

    if(!currentGoal) {
      return (
        <GoalList
          goals={goals}
          me={me}
          setActiveGoal={this.setActiveGoal}
        />
      )
    }
  }
  renderTimeline() {
    const { currentGoal, me, users, cachedData } = this.props;

    if (currentGoal) {
      let cache;
      if(cachedData){
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
  }
  render() {

    return (
      <div className='goals'>

        {this.renderList()}
        {this.renderTimeline()}
        {this.renderPlusButton()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const users = state.get('users');
  let goals = state.get('goals');

  if(goals) {
    goals = goals.map((g) => {
      return g.updateIn(['steps'], (steps) => steps.map((s) => {
        const assignees = s.get('assignees');
        return s.set('assignees', assignees.map((userId) => {
          return users.get(userId);
        }));
      }))
    })
  }

  return {
    goals: goals,
    currentGoal: goals.getIn([state.getIn(['main', 'activeGoal'])]),
    cachedData: state.getIn(['main', 'cache']),
    users: users,
    me: state.get('me')
  }
}

const ConnectedGoals = connect(mapStateToProps, {
  setOverlay: overlay.set,
  cacheSave: main.cacheSave,
  pushOverlay: overlay.push,
  popOverlay: overlay.pop,
  goalDelete: goals.delete,
  submit: goals.submitStep,
  setActiveGoal: main.setActiveGoal
})(Goals)

export default ConnectedGoals
