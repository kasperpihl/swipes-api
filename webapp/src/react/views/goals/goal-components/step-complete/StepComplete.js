import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import * as ca from 'swipes-core-js/actions';
import * as mainActions from 'src/redux/main/mainActions';

import { styleElement, SwissProvider } from 'react-swiss';
import styles from './StepComplete.swiss';


const Wrapper = styleElement('div', styles.Wrapper);
const Text = styleElement('div', styles.Text);

class StepComplete extends PureComponent {
  onStepComplete() {
    const { completeStep, goalId, stepId, successGradient } = this.props;

    completeStep(goalId, stepId).then((res) => {
      if (res && res.ok) {
        successGradient();
        window.analytics.sendEvent('Step completed', {});
      } else {
      }
    });
  }
  onStepIncomplete() {
    const { incompleteStep, goalId, stepId } = this.props;

    incompleteStep(goalId, stepId).then((res) => {
      if (res && res.ok) {
        window.analytics.sendEvent('Step incompleted', {});
      } else {
      }
    });
  }
  render() {
    const hoverClass = this.props.hoverClass || '.step-complete-hover';

    return (
      <SwissProvider
        hoverClass={hoverClass}
        isComplete={this.props.isComplete}>
        <Wrapper>
          <Text>{this.props.number}</Text>
        </Wrapper>
      </SwissProvider>
    );
  }
}

export default connect(null, {
  successGradient: mainActions.successGradient,
  completeStep: ca.goals.completeStep,
  incompleteStep: ca.goals.incompleteStep,
})(StepComplete);