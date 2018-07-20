import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withOptimist } from 'react-optimist';
import { setupLoading } from 'swipes-core-js/classes/utils';

import * as ca from 'swipes-core-js/actions';
import * as mainActions from 'src/redux/main/mainActions';
import Button from 'src/react/components/button/Button';
import SW from './GoalFooter.swiss';

@connect((state) => ({
}), {
  completeGoal: ca.goals.complete,
  incompleteGoal: ca.goals.incomplete,
  successGradient: mainActions.successGradient,
})
@withOptimist
export default class extends PureComponent {
  constructor(props) {
    super(props);
    props.optimist.identify(props.goal.get('id'));
    setupLoading(this);
  }
  onIncompleteGoal = () => {
    const { incompleteGoal, goal, optimist } = this.props;
    optimist.set({
      key: 'completed',
      value: false,
      handler: next => incompleteGoal(goal.get('id')).then((res) => {
        next();
      })
    })
  }
  onCompleteGoal = () => {
    const { completeGoal, successGradient, goal, optimist } = this.props;
    successGradient();
    optimist.set({
      key: 'completed',
      value: true,
      handler: next => completeGoal(goal.get('id')).then((res) => {
        next();
      })
    })
    // this.setLoading('completing', 'Completing goal...'); 
  }
  render() {
    const { goal, optimist } = this.props;
    const isComplete = optimist.get('completed', !!goal.get('completed_at'));

    return (
      <SW.Wrapper>
        <Button
          icon={isComplete ? 'Iteration' : 'Checkmark'}
          sideLabel={isComplete ? 'Incomplete goal' : 'Complete goal'}
          {...this.getLoading('completing')}
          onClick={isComplete ? this.onIncompleteGoal : this.onCompleteGoal}
        />
      </SW.Wrapper>
    )
  }
}
