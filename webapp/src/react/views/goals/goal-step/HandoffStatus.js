import React, { Component, PropTypes } from 'react';
import GoalsUtil from 'classes/goals-util';
import './styles/handoff-status.scss';

class HandoffStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  nameForUser(id) {
    const { users, me } = this.props;
    let name = 'Someone';
    const user = users.get(id);

    if (user) {
      name = user.get('name');
      if (user.get('id') === me.get('id')) {
        name = 'yourself';
      }
    }

    return name;
  }
  namesFromAssignees(assignees) {
    let assigneeString = '';
    const numOfAssignees = assignees.size;

    if (numOfAssignees > 0) {
      assigneeString += `${this.nameForUser(assignees.get(0))}`;
    }
    if (numOfAssignees === 2) {
      assigneeString += ` and ${this.nameForUser(assignees.get(1))}`;
    }
    if (numOfAssignees > 2) {
      assigneeString += ` and ${numOfAssignees - 1} others`;
    }

    return assigneeString;
  }
  renderStatus() {
    const { toId, goal } = this.props;
    const helper = this.getHelper();
    const to = helper.getStepById(toId);
    const toIndex = helper;
    let status = '';

    if (!to) {
      status = 'Complete this goal';
    } else {
      status = (
        <span>
          Handoff step to <b>{this.namesFromAssignees(to.get('assignees'))}</b> for "<b>{to.get('title')}</b>"
        </span>
      );
    }

    return status;
  }
  render() {
    return (
      <div className="goal-actions__status">
        {this.renderStatus()}
      </div>
    );
  }
}

export default HandoffStatus;

const { object } = PropTypes;

HandoffStatus.propTypes = {
  goal: object,
};
