import React, { PureComponent } from 'react';
import { styleElement } from 'react-swiss';
import { connect } from 'react-redux';
import HOCAssigning from 'components/assigning/HOCAssigning';
import StepComplete from '../step-complete/StepComplete';

import styles from './StepItem.swiss';

const Wrapper = styleElement('div', styles.Wrapper).debug();
const Title = styleElement('div', styles.Title);

class StepItem extends PureComponent {
  render() {
    const {
      number,
      step,
      goalId,
    } = this.props;

    return (
      <Wrapper className="step-complete-hover">
        <StepComplete
          number={number}
          goalId={goalId}
          stepId={step.get('id')}
          isComplete={!!step.get('completed_at')}
        />
        <Title>{step.get('title')}</Title>
        <HOCAssigning
          assignees={step.get('assignees')}
          rounded
          size={24}
        />
      </Wrapper>
    );
  }
}

export default connect()(StepItem);