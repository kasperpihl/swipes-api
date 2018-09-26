import React from 'react';
import SW from './PlanProgressTooltip.swiss';

export default (props) => {
  const {
    numberOfGoals,
    numberOfCompletedGoals,
    numberOfStepsLeft,
  } = props;

  return (
    <SW.Wrapper><b>{numberOfCompletedGoals}</b> from <b>{numberOfGoals}</b> goals completed and <b>{numberOfStepsLeft}</b> steps left</SW.Wrapper>
  );
};
