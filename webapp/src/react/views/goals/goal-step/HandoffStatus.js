import React, { Component, PropTypes } from 'react';

import './styles/handoff-status.scss';

class HandoffStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
  namesFromAssignees(source) {
    let assignees = '';
    const numOfAssignees = source.assignees.length;

    if (numOfAssignees > 0) {
      assignees += `${this.nameForUser(source.assignees[0])}`;
    }
    if (numOfAssignees === 2) {
      assignees += ` and ${this.nameForUser(source.assignees[1])}`;
    }
    if (numOfAssignees > 2) {
      assignees += ` and ${numOfAssignees - 1} others`;
    }

    return assignees;
  }
  renderStatus() {
    const { toId, goal } = this.props;
    let status = '';

    if (!to) {
      status = 'Complete this step';
    } else {
      const title = to.title.slice(to.title.indexOf(' ') + 1);
      status = `Handoff step to ${this.namesFromAssignees(to)} for "${title}"`;
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
  goal,
};
