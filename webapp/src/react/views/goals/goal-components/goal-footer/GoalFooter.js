import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { styleElement } from 'swiss-react';
import { setupLoading } from 'swipes-core-js/classes/utils';

import * as ca from 'swipes-core-js/actions';
import * as mainActions from 'src/redux/main/mainActions';
import Button from 'src/react/components/button/Button2';
import styles from './GoalFooter.swiss';

const Wrapper = styleElement('div', styles.Wrapper);

@connect((state) => ({
}), {
  completeGoal: ca.goals.complete,
  incompleteGoal: ca.goals.incomplete,
  successGradient: mainActions.successGradient,
})
export default class extends PureComponent {
  constructor(props) {
    super(props);
    setupLoading(this);
  }
  onIncompleteGoal = () => {
    const { incompleteGoal, completeGoal, successGradient, goal } = this.props;
    this.setLoading('completing', 'Incompleting goal...');
    incompleteGoal(goal.get('id')).then((res) => {
      if (res && res.ok) {
        this.clearLoading('completing');
      } else {
        this.clearLoading('completing', '!Something went wrong');
      }
    });
  }
  onCompleteGoal = () => {
    const { completeGoal, successGradient, goal } = this.props;
    this.setLoading('completing', 'Completing goal...');
    completeGoal(goal.get('id')).then((res) => {
      if (res && res.ok) {
        successGradient();
        this.clearLoading('completing');
      } else {
        this.clearLoading('completing', '!Something went wrong');
      }
    });
  }
  render() {
    const { goal } = this.props;
    const isComplete = !!goal.get('completed_at');

    return (
      <Wrapper>
        <Button
          icon={isComplete ? 'Iteration' : 'Checkmark'}
          sideLabel={isComplete ? 'Incomplete goal' : 'Complete goal'}
          {...this.getLoading('completing')}
          onClick={isComplete ? this.onIncompleteGoal : this.onCompleteGoal}
        />
      </Wrapper>
    )
  }
}
