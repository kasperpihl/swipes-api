import React, { PropTypes } from 'react';
import HOCAssigning from 'components/assigning/HOCAssigning';
import { list } from 'react-immutable-proptypes';
import Icon from 'Icon';

import './styles/goal-completed.scss';

const GoalCompleted = (props) => {
  const {
    title,
    assignees,
    subtitle,
  } = props;

  return (
    <div className="goal-completed">
      <div className="goal-completed__top">
        <Icon svg="Checkmark" className="goal-completed__icon" />
        <div className="goal-completed__title">{title}</div>
        <div className="goal-completed__assignees">
          <HOCAssigning assignees={assignees} />
        </div>
      </div>
      <div className="goal-completed__subtitle">{subtitle}</div>
    </div>
  );
};

export default GoalCompleted;

const { string } = PropTypes;

GoalCompleted.propTypes = {
  title: string,
  subtitle: string,
  assignees: list,
};
