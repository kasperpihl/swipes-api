import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { overlay, main, api, toasty, modal, goals } from '../../actions';
import { bindAll } from '../../classes/utils'

import { actionForType } from '../../components/goals/actions'
import TabBar from '../../components/tab-bar/TabBar'

import PureRenderMixin from 'react-addons-pure-render-mixin';
import GoalTimeline from '../../components/goals/GoalTimeline';

import GoalItem from '../../components/goals/GoalItem';
import { PlusIcon } from '../../components/icons'
import '../../components/goals/styles/goals.scss';

class Goals extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['clickedRoundButton', 'clickedListItem', 'completeStep']);
    this.updateTitle('Goals');
    this.addListenersToSwipes(props.swipes);
  }
  addListenersToSwipes(swipes){
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
  onCardShare(card, data){
    console.log('data', data);
    const { swipes } = this.props;

    const shareData = {};
    if(data.shortUrl){
      shareData.short_url = data.shortUrl;
      // Is a swipes url to reshare
    }
    swipes.sendEvent('share', shareData);
  }
  onCardAction(card, data, action){
    console.log('action', data, action);
  }
  onCardClick(card, data){
    //console.log(this.shareDataForChecksum[data.checksum]);
    if(data.shortUrl){
      const folder = localStorage.getItem('dropbox-folder');
      data = swipesUrlProvider.get(data.shortUrl);
      if(folder){
        var path = folder + data.subtitle + '/' + data.title;
        console.log('opening', window.ipcListener.sendEvent('showItemInFolder', path));
      }
    }

    console.log('clicked', data);
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
  completeStep(){
    const { currentGoal, completeStep } = this.props;
    completeStep(currentGoal.get('id'));
  }
  renderActionForStep(timeline, stepId){
    const { currentGoal } = this.props;
    if(currentGoal){
      const actionStep = currentGoal.get('steps').find((s) => s.get('id') === stepId)
      const View = actionForType(actionStep.get('type'), actionStep.get('subtype'));
      return <View swipes={this.props.swipes} completeStep={this.completeStep} cardDelegate={this} goal={currentGoal} step={actionStep}/>
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
      return <GoalTimeline goal={currentGoal} delegate={this}/>;
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
  onChange(index) {
    console.log(index);
  }
  renderTabbar() {
    let { currentGoal } = this.props;
    if(!currentGoal){
      return (
        <TabBar data={['mine', 'later', 'favorites', 'all']} onChange={this.onChange}/>
      )
    }
    
  }
  render() {

    return (
      <div className="goals">
        {this.renderTabbar()}
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
  if(goals){
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
    users: users
  }
}

const ConnectedGoals = connect(mapStateToProps, {
  setOverlay: overlay.set,
  loadModal: modal.load,
  completeStep: goals.completeStep,
  request: api.request,
  addToast: toasty.add,
  updateToast: toasty.update,
  setActiveGoal: main.setActiveGoal
})(Goals)
export default ConnectedGoals
