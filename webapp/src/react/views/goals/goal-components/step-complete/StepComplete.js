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
  constructor(props) {
    super(props);
    this.state = {};
  }
  onComplete = () => {
    const { completeStep, goalId, stepId, successGradient } = this.props;
    this.setState({ loading: true });
    completeStep(goalId, stepId).then((res) => {
      this.setState({ loading: false });
      if (res && res.ok) {
        successGradient();
        window.analytics.sendEvent('Step completed', {});
      }
    });
  }
  onIncomplete = () => {
    const { incompleteStep, goalId, stepId } = this.props;
    this.setState({ loading: true });
    incompleteStep(goalId, stepId).then((res) => {
      this.setState({ loading: false });
      if (res && res.ok) {
        window.analytics.sendEvent('Step incompleted', {});
      }
    });
  }
  render() {
    const { className, isComplete } = this.props;
    const { loading } = this.state;
    const hoverClass = this.props.hoverClass || '.step-complete-hover';

    return (
      <SwissProvider
        hoverClass={hoverClass}
        isComplete={isComplete}
        loading={loading}>
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