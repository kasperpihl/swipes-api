import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { overlay, main, api } from '../../actions';
import { bindAll } from '../../classes/utils'

import PureRenderMixin from 'react-addons-pure-render-mixin';
import GoalTimeline from '../../components/goals/GoalTimeline';

import GoalItem from '../../components/goals/GoalItem';
import { PlusIcon } from '../../components/icons'
import '../../components/goals/styles/goals.scss';

class Goals extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['addGoal', 'clickedListItem']);
    this.updateTitle('Goals');
    this.addListenersToSwipes(props.swipes);

    //props.swipes.sendEvent('navigation.setSubtitle', 'Approve Designs');
  }
  addListenersToSwipes(swipes){

    swipes.addListener('share.receivedData', (data) => {

    });
    swipes.addListener('menu.pressed', () => {
      this.goBack();
    })
  }
  goBack(){
    const { setActiveGoal } = this.props;
    setActiveGoal(null);
  }
  componentDidUpdate(){
    let { goals, currentGoalId } = this.props;
    if(currentGoalId){
      const goal = goals.get(currentGoalId);
      this.updateTitle(goal.get('title'));
    }
    else{
      this.updateTitle('Goals');
    }
  }
  updateTitle(title){
    if(title !== this.currentTitle){
      this.props.swipes.sendEvent('navigation.setTitle', title);
      this.currentTitle = title;
    }
  }
  timelineUpdateSubtitle(subtitle){
    this.props.swipes.sendEvent('navigation.setSubtitle', subtitle)
  }
  clickedListItem(id){
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
      return <GoalTimeline goal={goal} data={goal.toJS()} delegate={this}/>;
    }
    return null;
  }
  addGoal() {
    this.props.setOverlay({component: 'StartGoal', title: 'Start a Goal'});
  }
  renderPlusButton(){

    let className = 'fab';
    let icon = <PlusIcon className="fab__icon"/>

    if (true) {
      className += ' fab--add'
    }

    if (false) {
      className += ' fab--delete'
      icon = <div className="material-icons fab__icon">delete</div>
    }

    return (
      <div className={className} onClick={this.addGoal}>
        {icon}
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
