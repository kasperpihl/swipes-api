import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { overlay, main, api, goals } from '../../actions';
import { bindAll } from '../../classes/utils'

import TabBar from '../../components/tab-bar/TabBar'
import GoalStep from '../../components/goals/GoalStep'
import GoalList from '../../components/goals/GoalList'
import { PlusIcon } from '../../components/icons'

import '../../components/goals/styles/goals.scss';

class Goals extends Component {
  constructor(props) {
    super(props)
    bindAll(this, [
      'clickedRoundButton',
      'onChange'
    ]);
    this.state = { tabIndex: 0 };
    this.tabs = ['now', 'later', 'tags', 'all'];
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  onChange(index) {
    if(this.state.tabIndex !== index) {
      this.setState({tabIndex: index});
    }
  }

  renderList(){
    const { tabIndex } = this.state;
    const { currentGoal, goals, me, setActiveGoal } = this.props;
    if(!currentGoal){
      return <GoalList goals={goals} me={me} tabIndex={tabIndex} setActiveGoal={setActiveGoal}/>
    }
  }
  renderTabbar() {
    return (
      <div className="goals__tab-abs">
        <div className="goals__tab-bar">
          <TabBar data={this.tabs} align="left" onChange={this.onChange} activeTab={this.state.tabIndex}/>
        </div>
      </div>
    )
  }
  stepSubmit(step, goalId, stepId, data){
    const { submit } = this.props;
    console.log('submit!', data);
    submit(goalId, stepId, data);
  }
  renderTimeline(){
    const { currentGoal } = this.props;
    if (currentGoal) {
      return <GoalStep step={currentGoal.getIn(['steps', 0])} goal={currentGoal} delegate={this}/>;
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
