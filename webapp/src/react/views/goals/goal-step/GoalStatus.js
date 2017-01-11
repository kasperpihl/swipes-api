import React, { PropTypes } from 'react';
import HOCAssigning from 'components/assigning/HOCAssigning';
import Icon from 'Icon';

import './styles/goal-status';

const GoalStatus = (props) => {
  const {
    fromAssignees,
    toAssignees,
    message,
  } = props;

  return (
    <div className="goal-status">
      <div className="goal-status__assignee">
        <HOCAssigning assignees={fromAssignees} />
      </div>
      <div className="goal-status__arrow">
        <Icon svg="ArrowRightFull" className="goal-status__icon" />
      </div>
      <div className="goal-status__assignee">
        <HOCAssigning assignees={toAssignees} />
      </div>
      <div className="goal-status__message">
        {message}
      </div>
    </div>
  );
};

export default GoalStatus;

const { array, string } = PropTypes;

GoalStatus.propTypes = {
  fromAssignees: array,
  toAssignees: array,
  message: string,
};
