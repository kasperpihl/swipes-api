import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setupDelegate } from 'react-delegate';
import { bindAll } from 'swipes-core-js/classes/utils';
import * as ca from 'swipes-core-js/actions';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import HOCAssigning from 'components/assigning/HOCAssigning';

import SW from './GoalListItem.swiss';


@connect((state, props) => ({
  goal: state.goals.get(props.goalId),
}), {
  assignGoal: ca.goals.assign,
})
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onGoalClick').setGlobals(props.goalId);
    bindAll(this, ['onClick']);
  }
  onAssigningClose(assignees) {
    const { assignGoal, goal } = this.props
    if(assignees) {
      assignGoal(goal.get('id'), assignees.toJS()).then((res) => {
        if(res.ok){
          window.analytics.sendEvent('Goal assigned', {
            'Number of assignees': assignees.length,
          });
        }
      });
    }
  }
  onClick(e) {
    const selection = window.getSelection();

    if (selection.toString().length === 0) {
      this.onGoalClick(e);
    }
  }
  getHelper() {
    const { goal } = this.props;
    return new GoalsUtil(goal);
  }
  renderAssignees() {
    const { goal, inTakeAction } = this.props;
    let { status } = this.props;
    const helper = this.getHelper();

    if (!status) {
      status = helper.getIsCompleted() ? 'Done' : 'Now';
    }

    if (status === 'Done' || inTakeAction) {
      return undefined;
    }

    return (
      <HOCAssigning
        assignees={helper.getAssignees()}
        maxImages={1}
        delegate={this}
        rounded
        size={30}
        enableTooltip
      />
    );
  }
  render() {
    const { goal, fromMilestone, loading } = this.props;
    let { status } = this.props;

    if(!status) {
      const helper = this.getHelper();
      status = helper.getIsCompleted() ? 'Done' : 'Now'
    }

    return (
      <SW.Wrapper onClick={this.onGoalClick}>
        <SW.StatusDot status={status} />
        <SW.Title
          status={status}
          hoverRef=".goal-item"
        >
          {loading || goal.get('title')}
        </SW.Title>
        {this.renderAssignees()}
      </SW.Wrapper>
    );
  }
}
