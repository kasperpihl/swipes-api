import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { styleElement } from 'react-swiss';

import StepComplete from '../step-complete/StepComplete';

import styles from './StepItem.swiss';

const Wrapper = styleElement('div', styles.Wrapper);

class StepItem extends PureComponent {
  render() {
    return (
      <Wrapper>
        <StepComplete number="2" />
      </Wrapper>
    );
  }
}

export default connect((state) => ({
}), {})(StepItem);