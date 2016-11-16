import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { overlay, main, api, goals } from '../../actions';
import { bindAll } from '../../classes/utils'

import NavBar from '../../components/nav-bar/NavBar'
import GoalStep from '../../components/goals/GoalStep'
import GoalList from '../../components/goals/GoalList'
import { PlusIcon } from '../../components/icons'

import '../../components/goals/styles/goals.scss';

class Goals extends Component {
  constructor(props) {
    super(props)
    bindAll(this, [
      'clickedRoundButton'
    ]);
    this.state = { tabIndex: 0 };
    this.tabs = ['now', 'later', 'tags', 'all'];
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  renderList(){
    const { tabIndex } = this.state;
    const { currentGoal, goals, me, setActiveGoal } = this.props;
    if(!currentGoal){
      return <GoalList goals={goals} me={me} tabIndex={tabIndex} setActiveGoal={setActiveGoal}/>
    }
  }
  navTabDidChange(nav, index){
    if(this.state.tabIndex !== index) {
      this.setState({tabIndex: index});
    }
  }
  navPressedBack(nav){
    const { setActiveGoal } = this.props;
    setActiveGoal();
  }
  renderTabbar() {
    let navTitle, navSteps, navStepIndex;
    const { currentGoal } = this.props;
    if (currentGoal) {
      navTitle = currentGoal.get('title');
      navSteps = currentGoal.get('steps').map((s) => {
        return { title: s.get('title'), completed: s.get('completed')}
      }).toJS()
      navStepIndex = currentGoal.get('currentStepIndex') || 0;
    }
    return (
        <div className="goals__nav-bar">
          <NavBar tabs={this.tabs} stepIndex={navStepIndex} steps={navSteps} title={navTitle} delegate={this} activeTab={this.state.tabIndex}/>
        </div>
    )
  }
  stepSubmit(step, goalId, stepId, data, previousSteps){
    const { submit } = this.props;
    submit(goalId, stepId, data, previousSteps);
  }
  renderTimeline(){
    const { currentGoal } = this.props;
    if (currentGoal) {
      return <GoalStep step={currentGoal.getIn(['steps', currentGoal.get('currentStepIndex')])} goal={currentGoal} delegate={this}/>;
    }
  }
  clickedRoundButton() {
    const {
      setOverlay
    } = this.props;

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

  render() {
    return (
      <div className='goals'>
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
    users: users,
    me: state.get('me')
  }
}

const ConnectedGoals = connect(mapStateToProps, {
  setOverlay: overlay.set,
  request: api.request,
  submit: goals.submitStep,
  setActiveGoal: main.setActiveGoal
})(Goals)
export default ConnectedGoals
