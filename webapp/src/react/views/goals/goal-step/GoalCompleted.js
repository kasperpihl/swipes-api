import React, { PropTypes } from 'react';

const GoalCmpleted = (props) => {
  const {
    title,
  } = props;

  return (
    <div className="goal-completed">
      {title}
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
