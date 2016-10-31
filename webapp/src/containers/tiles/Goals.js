import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { overlay, main, api, toasty, modal, goals, workspace } from '../../actions';
import { bindAll } from '../../classes/utils'
import { actionForType } from '../../components/goals/actions'
import TabBar from '../../components/tab-bar/TabBar'
import GoalTimeline from '../../components/goals/GoalTimeline';
import GoalItem from '../../components/goals/GoalItem';
import TagItem from '../../components/tags/TagItem';
import { PlusIcon } from '../../components/icons'
import Button from '../../components/swipes-ui/Button'

import '../../components/goals/styles/goals.scss';

class Goals extends Component {
  constructor(props) {
    super(props)
    this.tabs = ['now', 'later', 'tags', 'all'];
    this.state = { tabIndex: 0 };
    this.tags = [
      'development',
      'design',
      'v1',
      'beta',
      'bugs',
      'marketing',
      'sales',
      'vacation',
      'team building'
    ]
    bindAll(this, [
      'clickedRoundButton',
      'clickedListItem',
      'completeStep',
      'filterGoals',
      'onChange',
      'filterMine',
      'filterLater'
    ]);
    this.updateTitle('Goals');
    this.addListenersToSwipes(props.swipes);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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
  openActionTile(stepId, title){
    const { tiles, addTile } = this.props;
    if(!tiles.get(stepId)){
      addTile({id: stepId, name: title});
    }
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
  renderList() {
    const { tabIndex } = this.state;
    let { goals, currentGoal } = this.props;

    if (currentGoal || tabIndex === 2) {
      return;
    }

    goals = goals.sort((a, b) => b.get('timestamp').localeCompare(a.get('timestamp'))).toArray();
    goals = this.filterGoals(goals);

    return goals.map((goal) => {
      return <GoalItem onClick={this.clickedListItem} data={goal} key={'goal-list-item-' + goal.get('id')}/>
    })
  }
  completeStep(stepId) {
    const { currentGoal, completeStep } = this.props;
    const goalId = currentGoal.get('id');

    completeStep(goalId, stepId);
  }
  renderActionForStep(timeline, stepId) {
    const { currentGoal } = this.props;
    if(currentGoal){
      const actionStep = currentGoal.get('steps').find((s) => s.get('id') === stepId)
      const View = actionForType(actionStep.get('type'), actionStep.get('subtype'));
      if(typeof View.actionTile === 'function'){
        const buttonTitle = View.actionTile();
        return <Button title={buttonTitle} callback={this.openActionTile.bind(this, stepId, buttonTitle)} />
      }
      return <View swipes={this.props.swipes} completeStep={this.completeStep} cardDelegate={this} goal={currentGoal} step={actionStep}/>
    }
    return null;
  }
  renderSecondaryActionForStep(timeline, stepId) {
    const { currentGoal } = this.props;
    if (currentGoal) {
      const actionStep = currentGoal.get('steps').find((s) => s.get('id') === stepId)
      const secondaryActions = actionStep.get('secondary');

      if (!secondaryActions) {
        return null;
      }

      return secondaryActions.map((action, i) => {
        const actionData = action.get('data');
        const View = actionForType('secondary', action.get('type'));

        return <View key={'secondary-' + i} swipes={this.props.swipes} completeStep={this.completeStep} cardDelegate={this} goal={currentGoal} step={actionStep} actionData={actionData} />
      })
    }

    return null;
  }
  getStatusForStep(timeline, stepId){

  }
  statusForGoal(){

  }
  renderTimeline(){
    const { tabIndex } = this.state;
    const { currentGoal } = this.props;

    if (currentGoal) {
      return <GoalTimeline goal={currentGoal} delegate={this}/>;
    }
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
              updateToast(toastId, {title: 'Goal deleted', completed: true, duration: 3000});
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
  filterGoals(goals){
    const { tabIndex } = this.state;
    const tab = this.tabs[tabIndex];

    switch(tab){
      case 'mine':
        return this.filterMine(goals);
      case 'later':
        return this.filterLater(goals);
      case 'tags':
      case 'all':
        return goals;
      default:
        return this.filterMine(goals);
    }
  }
  filterMine(goals) {
    const {
      me
    } = this.props;

    return goals.filter((goal) => {
      const steps = goal.get('steps');
      const currentStep = steps.find((step) => {
        return step.get('completed') !== true;
      })

      if (!currentStep) {
        return false;
      }

      const assignees = currentStep.get('assignees');
      const containsMe = assignees.find((user) => {
        if (user.get('id') === me.get('id')) {
          return true;
        }

        return false;
      })

      if (!containsMe) {
        return false;
      }

      return true;
    })
  }
  filterLater(goals) {
    const {
      me
    } = this.props;

    return goals.filter((goal) => {
      const steps = goal.get('steps');
      let indexCompleted = null;
      let match = null;

      const currentStep = steps.findEntry((step) => {
        return step.get('completed') !== true;
      })

      if (!currentStep) {
        return false;
      }

      indexCompleted = currentStep[0];

      steps.forEach((step, i) => {
        if (i > indexCompleted) {
          const assignees = step.get('assignees');
          const containsMe = assignees.find((user) => {
            if (user.get('id') === me.get('id')) {
              return true;
            }

            return false;
          })

          if (containsMe) {
            match = true;
            // Stop the forEach
            return false;
          }
        }
      })

      if (match) {
        return true;
      }

      return false;
    })
  }
  onChange(index) {
    if(this.state.tabIndex !== index) {
      this.setState({tabIndex: index});
    }
  }
  renderTabbar() {
    const { currentGoal } = this.props;

    if (!currentGoal) {
      return (
        <TabBar data={this.tabs} align="left" onChange={this.onChange}/>
      )
    }
  }
  renderTagsList() {
    const { tabIndex } = this.state;
    let items = [];

    items = this.tags.map((tag, i) => {
      return <TagItem text={tag} key={'tag-item-' + i} />
    })

    if (tabIndex === 2) {
      return (
        <div className="goals__tags">{items}</div>
      )
    }
  }
  render() {
    return (
      <div className='goals'>
        {this.renderTabbar()}
        {this.renderList()}
        {this.renderTimeline()}
        {this.renderTagsList()}
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
    users: users,
    tiles: state.getIn(['workspace', 'tiles']),
    me: state.get('me')
  }
}

const ConnectedGoals = connect(mapStateToProps, {
  setOverlay: overlay.set,
  loadModal: modal.load,
  completeStep: goals.completeStep,
  addTile: workspace.addTile,
  request: api.request,
  addToast: toasty.add,
  updateToast: toasty.update,
  setActiveGoal: main.setActiveGoal
})(Goals)
export default ConnectedGoals
