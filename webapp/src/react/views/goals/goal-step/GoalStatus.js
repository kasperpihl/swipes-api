import React, { PropTypes } from 'react';
import HOCAssigning from 'components/assigning/HOCAssigning';

import './styles/goal-status';

const GoalStatus = (props) => {
  const {
    fromAssignees,
    toAssignees,
    message,
  } = props;

  return (
    <div className="goal-status">
      <div className="goal-status__from">
        <HOCAssigning assignees={fromAssignees} />
      </div>
      {/* insert the arrow here */}
      <div className="goal-status__to">
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
