import React from 'react';
import { styleElement } from 'swiss-react';

const Wrapper = styleElement('PlanProgressTooltip_Wrapper', {
  _borderRadius: '12px',
  _font: ['12px', '16px'],
  padding: '5px',
  background: '$sw1',
  color: 'white',
});

export default (props) => {
  const {
    numberOfGoals,
    numberOfCompletedGoals,
    numberOfStepsLeft,
  } = props;

  return (
    <Wrapper><b>{numberOfCompletedGoals}</b> from <b>{numberOfGoals}</b> goals completed and <b>{numberOfStepsLeft}</b> steps left</Wrapper>
  );
};