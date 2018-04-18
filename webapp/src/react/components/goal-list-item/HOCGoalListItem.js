import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { styleElement } from 'react-swiss';
import { setupDelegate } from 'react-delegate';
import { bindAll } from 'swipes-core-js/classes/utils';
import * as ca from 'swipes-core-js/actions';
import * as goalActions from 'src/redux/goal/goalActions';
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
  onAssign(i, e) {
    const options = this.getOptionsForE(e);
    const { selectAssignees, assignGoal, goal, inTakeAction } = this.props;

    let overrideAssignees;
    options.onClose = () => {
      if (overrideAssignees) {
        assignGoal(goal.get('id'), overrideAssignees).then((res) => {
          if(res.ok){
            window.analytics.sendEvent('Goal assigned', {
              'Number of assignees': overrideAssignees.length,
            });
          }
        });
      }
    }
    selectAssignees(options, goal.get('assignees').toJS(), (newAssignees) => {
      if (newAssignees) {
        overrideAssignees = newAssignees;
      }
    });
    e.stopPropagation();
  }
  onClick(e) {
    const selection = window.getSelection();

    console.log('hi mofo')

    if (selection.toString().length === 0) {
      this.onGoalClick(e);
    }
  }
  getHelper() {
    const { goal } = this.props;
    return new GoalsUtil(goal);
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
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
  selectAssignees: goalActions.selectAssignees,
  assignGoal: ca.goals.assign,
})(HOCGoalListItem);
