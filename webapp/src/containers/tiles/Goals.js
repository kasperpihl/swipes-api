import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../constants/ActionTypes'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import GoalTimeline from '../../components/goals/GoalTimeline'

class Goals extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    props.swipes.sendEvent('navigation.setTitle', 'Design icons');
    props.swipes.sendEvent('navigation.setSubtitle', 'Approve Designs');
  }
  timelineUpdateSubtitle(subtitle){
    this.props.swipes.sendEvent('navigation.setSubtitle', subtitle)
  }
  render() {
    const props = {};
    props.data = first;
    return (
      <GoalTimeline {...props} delegate={this}/>
    )
  }
}

function mapStateToProps(state) {
  return {
    goals: state.get('goals')
  }
}

const ConnectedGoals = connect(mapStateToProps, {
})(Goals)
export default ConnectedGoals





const first = [
  {
    currentStep: false,
    completed: true,
    active: false,
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
    currentStep: true,
    completed: false,
    active: true,
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
    currentStep: false,
    completed: false,
    active: false,
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
    currentStep: true,
    completed: false,
    active: false,
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
