import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { styleElement } from 'react-swiss';
import { setupDelegate } from 'react-delegate';
import { bindAll } from 'swipes-core-js/classes/utils';
import * as ca from 'swipes-core-js/actions';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import Icon from 'Icon';
import HOCAssigning from 'components/assigning/HOCAssigning';

import styles from './GoalListItem.swiss';
/* global msgGen */

const GoalItem = styleElement('div', styles.GoalItem);
const GoalTitle = styleElement('div', styles.GoalTitle);
const StatusDot = styleElement('div', styles.StatusDot);

class HOCGoalListItem extends PureComponent {
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
      />
    );
  }
  render() {
    const { goal, fromMilestone, loading, inTakeAction } = this.props;
    let { status } = this.props;

    if(!status) {
      const helper = this.getHelper();
      status = helper.getIsCompleted() ? 'Done' : 'Now'
    }

    return (
      <GoalItem className="goal-item" onClick={this.onGoalClick}>
        <StatusDot status={status} />
        <GoalTitle
          inTakeAction={inTakeAction}
          status={status}
          hoverRef=".goal-item"
        >
          {loading || goal.get('title')}
        </GoalTitle>
        {this.renderAssignees()}
      </GoalItem>
    );
  }
}

export default connect((state, props) => ({
  goal: state.getIn(['goals', props.goalId]),
}), {
  assignGoal: ca.goals.assign,
})(HOCGoalListItem);
