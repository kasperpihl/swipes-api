import React from 'react';
import { styleElement } from 'react-swiss';
// import styles from './PlanProgressTooltip.swiss';

const styles = {
  Wrapper: {
    background: 'red',
  }
};

const Wrapper = styleElement('div', styles.Wrapper);

export default (props) => {
  return (
    <Wrapper>goal: {props.numberOfGoals}</Wrapper>
  );
};