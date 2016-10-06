import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { bindAll } from '../../classes/utils'

import PureRenderMixin from 'react-addons-pure-render-mixin';
import GoalTimeline from '../../components/goals/GoalTimeline';
import { overlay, main } from '../../actions';
import GoalItem from '../../components/goals/GoalItem';
import { PlusIcon } from '../../components/icons'
import '../../components/goals/styles/goals.scss';

class Goals extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['addGoal', 'clickedListItem']);
    props.swipes.sendEvent('navigation.setTitle', 'Design icons');
    props.swipes.sendEvent('navigation.setSubtitle', 'Approve Designs');
  }
  timelineUpdateSubtitle(subtitle){
    this.props.swipes.sendEvent('navigation.setSubtitle', subtitle)
  }
  clickedListItem(id){

    console.log(id, this.props.goals.get(id).toJS());
    this.props.setActiveGoal(id);
  }
  renderList(){
    let { goals, currentGoalId } = this.props;
    if(currentGoalId){
      return;
    }
    goals = goals.sort((a, b) => b.get('timestamp').localeCompare(a.get('timestamp'))).toArray();
    return goals.map((goal) => {
      return <GoalItem onClick={this.clickedListItem} data={goal} key={'goal-list-item-' + goal.get('id')}/>
    })
  }
  renderTimeline(){
    let { goals, currentGoalId } = this.props;
    if(currentGoalId){
      const goal = goals.get(currentGoalId);
      return <GoalTimeline data={goal.toJS()} delegate={this}/>;
    }
    return null;
  }
  addGoal() {
    this.props.setOverlay({component: 'StartGoal', title: 'Start a Goal'});
  }
  renderPlusButton(){

    return (
      <div className="fab fab--goals" onClick={this.addGoal}>
        <PlusIcon className="fab__icon"/>
      </div>
    )
  }
  render() {

    return (
      <div className="goals">
        {this.renderList()}
        {this.renderTimeline()}
        {this.renderPlusButton()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    goals: state.get('goals'),
    currentGoalId: state.getIn(['main', 'activeGoal'])
  }
}

const ConnectedGoals = connect(mapStateToProps, {
  setOverlay: overlay.set,
  setActiveGoal: main.setActiveGoal
})(Goals)
export default ConnectedGoals
