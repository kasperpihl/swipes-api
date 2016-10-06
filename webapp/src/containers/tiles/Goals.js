import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../constants/ActionTypes'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import GoalTimeline from '../../components/goals/GoalTimeline';
import { overlay } from '../../actions';
import GoalItem from '../../components/goals/GoalItem';
import { PlusIcon } from '../../components/icons'
import '../../components/goals/styles/goals.scss';

class Goals extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.addGoal = this.addGoal.bind(this);
    props.swipes.sendEvent('navigation.setTitle', 'Design icons');
    props.swipes.sendEvent('navigation.setSubtitle', 'Approve Designs');
  }
  timelineUpdateSubtitle(subtitle){
    this.props.swipes.sendEvent('navigation.setSubtitle', subtitle)
  }
  renderList(){
    let { goals } = this.props;

    goals = goals.sort((a, b) => b.get('timestamp').localeCompare(a.get('timestamp'))).toArray();
    return goals.map((goal) => {
      return <GoalItem data={goal} key={'goal-list-item-' + goal.get('id')}/>
    })
  }
  renderTimeline(){
    return null;
    const props = {};
    props.data = first;
    return <GoalTimeline {...props} delegate={this}/>;
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
    goals: state.get('goals')
  }
}

const ConnectedGoals = connect(mapStateToProps, {
  setOverlay: overlay.set
})(Goals)
export default ConnectedGoals





const first = [
  {
    completed: true,
    title: 'Icon Design',
    type: 'DELIVERY',
    assignees: {
      img: '',
      count: 4
    },
    description: 'When Creating as template, you edit the goal, from the perspective of which things should filled out when someone selects this template. Say… for example you have a decision step for approval and you won\'t be the decision maker all the time, you can leave that field as to be left “blank”, meaning once created, the person can choose the decision maker.',
    completeButton: true
  },
  {
    completed: false,
    title: 'Approve designs1',
    type: 'DECISION',
    assignees: {
      img: '',
      count: 1
    },
    description: 'When Creating as template, you edit the goal, from the perspective of which things should filled out when someone selects this template. Say… for example you have a decision step for approval and you won\'t be the decision maker all the time, you can leave that field as to be left “blank”, meaning once created, the person can choose the decision maker.',
    statusLabel: 'Stefan needs to complete previous step'
  },
  {
    completed: false,
    title: 'Upload files to Dropbox',
    type: 'ACTION',
    assignees: {
      img: '',
      count: 1
    },
    description: 'When Creating as template, you edit the goal, from the perspective of which things should filled out when someone selects this template. Say… for example you have a decision step for approval and you won\'t be the decision maker all the time, you can leave that field as to be left “blank”, meaning once created, the person can choose the decision maker.',
    statusLabel: 'Stefan needs to complete previous step'
  },
  {
    completed: false,
    title: 'Wait for implementation',
    type: 'WAITING',
    assignees: {
      img: '',
      count: 1
    },
    description: 'When Creating as template, you edit the goal, from the perspective of which things should filled out when someone selects this template. Say… for example you have a decision step for approval and you won\'t be the decision maker all the time, you can leave that field as to be left “blank”, meaning once created, the person can choose the decision maker.',
    statusLabel: 'Stefan needs to complete previous step'
  },

];
