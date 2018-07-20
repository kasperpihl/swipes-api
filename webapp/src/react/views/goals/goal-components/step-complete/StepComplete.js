import React, { PureComponent } from 'react';
import { withOptimist } from 'react-optimist';
import { connect } from 'react-redux';
import * as ca from 'swipes-core-js/actions';
import * as mainActions from 'src/redux/main/mainActions';

import { SwissProvider } from 'swiss-react';
import SW from './StepComplete.swiss';

@connect(null, {
  successGradient: mainActions.successGradient,
  completeStep: ca.goals.completeStep,
  incompleteStep: ca.goals.incompleteStep,
})
@withOptimist
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    props.optimist.identify(props.goalId);
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  onComplete = () => {
    const { completeStep, goalId, stepId, successGradient, optimist } = this.props;
    let goalNext;
    successGradient();
    optimist.set({
      key: `${stepId}-completed`,
      value: true,
      handler: (next) => completeStep(goalId, stepId).then((res) => {
        next();
        if(goalNext) goalNext();
        if (res && res.ok) {
          window.analytics.sendEvent('Step completed', {});
        }
      })
    });
    if(this.props.areAllStepsCompleted()) {
      optimist.set({
        key: 'completed',
        value: true,
        handler: (next) => {
          goalNext = next;
        }
      });
    }
  }
  onIncomplete = () => {
    const { incompleteStep, goalId, stepId, optimist } = this.props;
    
    let goalNext;
    if(this.props.areAllStepsCompleted()) {
      optimist.set({
        key: 'completed',
        value: false,
        handler: (next) => {
          goalNext = next;
        }
      });
    }
    optimist.set({
      key: `${stepId}-completed`,
      value: false,
      handler: (next) => incompleteStep(goalId, stepId).then((res) => {
        next();
        if(goalNext) goalNext();
        if (res && res.ok) {
          window.analytics.sendEvent('Step incompleted', {});
        }
      })
    });
    
  }
  render() {
    const { className, isComplete, optimist, stepId } = this.props;
    const { tempState } = this.state;
    const hoverClass = this.props.hoverClass || '.step-complete-hover';

    optimist.get(`${stepId}-completed`, 'completed', isComplete)
    const completeState = 
      optimist.get(`${stepId}-completed`, optimist.get('completed', isComplete));
    return (
      <SwissProvider
        hoverClass={hoverClass}
        isComplete={completeState}>
        <SW.Wrapper
          onClick={completeState ? this.onIncomplete : this.onComplete}
          className={`sc-wrapper ${className || ''}`.trim()}>
          <SW.Text>{this.props.number}</SW.Text>
          <SW.Icon icon={completeState ? 'Iteration' : 'Checkmark'} />
        </SW.Wrapper>
      </SwissProvider>
    );
  }
}
