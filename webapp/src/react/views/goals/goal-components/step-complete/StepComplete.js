import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import * as ca from 'swipes-core-js/actions';
import * as mainActions from 'src/redux/main/mainActions';

import { styleElement, SwissProvider } from 'react-swiss';
import styles from './StepComplete.swiss';

import Icon from 'Icon';

const Wrapper = styleElement('div', styles.Wrapper);
const Text = styleElement('div', styles.Text);
const StyledIcon = styleElement(Icon, styles.Icon);

class StepComplete extends PureComponent {
  onComplete = () => {
    const { completeStep, goalId, stepId, successGradient } = this.props;

    completeStep(goalId, stepId).then((res) => {
      if (res && res.ok) {
        successGradient();
        window.analytics.sendEvent('Step completed', {});
      } else {
      }
    });
  }
  onIncomplete = () => {
    const { incompleteStep, goalId, stepId } = this.props;

    incompleteStep(goalId, stepId).then((res) => {
      if (res && res.ok) {
        window.analytics.sendEvent('Step incompleted', {});
      } else {
      }
    });
  }
  render() {
    const { className, isComplete } = this.props;
    const hoverClass = this.props.hoverClass || '.step-complete-hover';

    return (
      <SwissProvider
        hoverClass={hoverClass}
        isComplete={isComplete}>
        <Wrapper
          onClick={isComplete ? this.onIncomplete : this.onComplete}
          className={`sc-wrapper ${className || ''}`.trim()}>
          <Text>{this.props.number}</Text>
          <StyledIcon icon={isComplete ? 'Iteration' : 'Checkmark'} />
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