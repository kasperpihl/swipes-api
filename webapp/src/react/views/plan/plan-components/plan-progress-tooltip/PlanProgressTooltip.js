import React from 'react';
import { styleElement } from 'react-swiss';
// import styles from './PlanProgressTooltip.swiss';

const styles = {
  Wrapper: {
    _borderRadius: '12px',
    _font: ['12px', '16px'],
    padding: '5px',
    background: '$sw1',
    color: 'white',
  }
};

const Wrapper = styleElement('div', styles.Wrapper);

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