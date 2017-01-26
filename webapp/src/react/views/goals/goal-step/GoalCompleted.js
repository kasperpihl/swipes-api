import React, { PropTypes } from 'react';
import HOCAssigning from 'components/assigning/HOCAssigning';

import './styles/goal-completed.scss';

const GoalCmpleted = (props) => {
  const {
    title,
    assignees,
    subtitle,
  } = props;

  return (
    <div className="goal-completed">
      <div className="goal-completed__assignees">
        <HOCAssigning assignees={assignees} />
      </div>
      <div className="goal-completed__content">
        <div className="goal-completed__title">{title}</div>
        <div className="goal-completed__subtitle">{subtitle}</div>
      </div>
    </div>
  );
};

export default GoalCmpleted;

const { string, array } = PropTypes;

GoalCmpleted.propTypes = {
  title: string,
  subtitle: string,
  assignees: array,
};
