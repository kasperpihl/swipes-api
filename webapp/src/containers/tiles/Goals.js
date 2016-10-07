import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { overlay, main, api, toasty, modal } from '../../actions';
import { bindAll } from '../../classes/utils'

import { actionForType } from '../../components/goals/actions'

import PureRenderMixin from 'react-addons-pure-render-mixin';
import GoalTimeline from '../../components/goals/GoalTimeline';

import GoalItem from '../../components/goals/GoalItem';
import { PlusIcon } from '../../components/icons'
import '../../components/goals/styles/goals.scss';

class Goals extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['clickedRoundButton', 'clickedListItem']);
    this.updateTitle('Goals');
    this.addListenersToSwipes(props.swipes);
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
    let { goals, currentGoal } = this.props;
    if(currentGoal){
      this.updateTitle(currentGoal.get('title'));
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
    let { goals, currentGoal } = this.props;
    if(currentGoal){
      return;
    }
    goals = goals.sort((a, b) => b.get('timestamp').localeCompare(a.get('timestamp'))).toArray();
    return goals.map((goal) => {
      return <GoalItem onClick={this.clickedListItem} data={goal} key={'goal-list-item-' + goal.get('id')}/>
    })
  }
  renderActionForStep(timeline, stepId){
    const { currentGoal } = this.props;
    if(currentGoal){
      const actionStep = currentGoal.get('steps').find((s) => s.get('id') === stepId)
      const View = actionForType(actionStep.get('type'), actionStep.get('subtype'));
      return <View goal={currentGoal} step={actionStep}/>
    }
    return null;
  }
  getStatusForStep(timeline, stepId){

  }
  statusForGoal(){

  }
  renderTimeline(){
    let { currentGoal, users } = this.props;
    if(currentGoal){
      let goal = currentGoal.updateIn(['steps'], (s) => s.map((step) => {
        const assignees = step.get('assignees');
        return step.set('assignees', assignees.map((userId) => {
          return users.get(userId);
        }));
      }))
      return <GoalTimeline goal={goal} delegate={this}/>;
    }
    return null;
  }
  clickedRoundButton() {
    const { 
      addToast, 
      updateToast,
      loadModal,
      currentGoal,
      setOverlay,
      request
    } = this.props;

    if(!currentGoal){
      setOverlay({component: 'StartGoal', title: 'Start a Goal'});
    }
    else{
      loadModal({title: 'Delete Goal?', data: {message: 'Are you sure you want to delete this goal?', buttons: ['No', 'Yes']}, type: 'warning'}, (res) => {
        if(res && res.button){
          this.goBack();
          addToast({title: 'Deleting Goal', loading: true}).then((toastId) => {
            request('goals.delete', {goal_id: currentGoal.get('id')}).then((res) =>{
              updateToast(toastId, {title: 'Goal deleted', loading: false, duration: 3000});
            });
          })
        }
      })      
    }
    
  }
  renderPlusButton(){
    const { currentGoal } = this.props;
    let className = 'fab';
    let icon = <PlusIcon className="fab__icon"/>

    if (!currentGoal) {
      className += ' fab--add'
    }
    else {
      className += ' fab--delete'
      icon = <div className="material-icons fab__icon">delete</div>
    }

    return (
      <div className={className} onClick={this.clickedRoundButton}>
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
    currentGoal: state.getIn(['goals', state.getIn(['main', 'activeGoal'])]),
    users: state.get('users')
  }
}

const ConnectedGoals = connect(mapStateToProps, {
  setOverlay: overlay.set,
  loadModal: modal.load,
  request: api.request,
  addToast: toasty.add,
  updateToast: toasty.update,
  setActiveGoal: main.setActiveGoal
})(Goals)
export default ConnectedGoals
