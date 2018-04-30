import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { styleElement } from 'react-swiss';

import HOCAssigning from 'components/assigning/HOCAssigning';
import StepComplete from '../step-complete/StepComplete';

import styles from './StepItem.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Title = styleElement('div', styles.Title);

class StepItem extends PureComponent {
  render() {
    const {
      number,
      step,
    } = this.props;

    return (
      <Wrapper className="step-complete-hover">
        <StepComplete number={1} />
        <Title>{step.get('title')}</Title>
        <HOCAssigning
          assignees={['me']}
          rounded
          size={24}
        />
      </Wrapper>
    );
  }
}

export default connect((state) => ({
  step: state.getIn(['goals', 'G4PGUUMF2', 'steps', '5q2RHZ']),
}), {})(StepItem);