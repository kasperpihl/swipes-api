import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import * as ca from 'swipes-core-js/actions';
import * as mainActions from 'src/redux/main/mainActions';

import { styleElement, SwissProvider } from 'swiss-react';
import styles from './StepComplete.swiss';

import Icon from 'Icon';

const Wrapper = styleElement('div', styles.Wrapper);
const Text = styleElement('div', styles.Text);
const StyledIcon = styleElement(Icon, styles.Icon);

@connect(null, {
  successGradient: mainActions.successGradient,
  completeStep: ca.goals.completeStep,
  incompleteStep: ca.goals.incompleteStep,
})
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  onComplete = () => {
    const { completeStep, goalId, stepId, successGradient } = this.props;
    this.setState({ tempState: true });
    successGradient();
    completeStep(goalId, stepId).then((res) => {
      !this._unmounted && this.setState({ tempState: null });
      if (res && res.ok) {
        window.analytics.sendEvent('Step completed', {});
      }
    });
  }
  onIncomplete = () => {
    const { incompleteStep, goalId, stepId } = this.props;
    this.setState({ tempState: false });
    incompleteStep(goalId, stepId).then((res) => {
      !this._unmounted && this.setState({ tempState: null });
      if (res && res.ok) {
        window.analytics.sendEvent('Step incompleted', {});
      }
    });
  }
  render() {
    const { className, isComplete } = this.props;
    const { tempState } = this.state;
    const hoverClass = this.props.hoverClass || '.step-complete-hover';

    const completeState = (typeof tempState === 'boolean') ? tempState : isComplete;
    return (
      <SwissProvider
        hoverClass={hoverClass}
        isComplete={completeState}>
        <Wrapper
          onClick={completeState ? this.onIncomplete : this.onComplete}
          className={`sc-wrapper ${className || ''}`.trim()}>
          <Text>{this.props.number}</Text>
          <StyledIcon icon={completeState ? 'Iteration' : 'Checkmark'} />
        </Wrapper>
      </SwissProvider>
    );
  }
}
