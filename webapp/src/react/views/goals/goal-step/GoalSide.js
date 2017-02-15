import React, { Component, PropTypes } from 'react';
import StepList from 'components/step-list/StepList';
import { map } from 'react-immutable-proptypes';
import GoalsUtil from 'classes/goals-util';

class GoalSide extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getHelper() {
    const { goal } = this.props;
    return new GoalsUtil(goal);
  }
  renderProgress() {
    const helper = this.getHelper();
    const numberOfCompleted = helper.getNumberOfCompletedSteps();
    const totalSteps = helper.getTotalNumberOfSteps();
    const styles = {};

    const progressLength = 100 - ((numberOfCompleted * 100) / totalSteps);
    styles.WebkitClipPath = `inset(0 ${Math.min(97, progressLength)}% 0 0)`;

    return (
      <div className="goal-side__progress-bar">
        <div className="progress-bar">
          <div className="progress-bar__fill" style={styles} />
          <div className="progress-bar__status">{numberOfCompleted}/{totalSteps} Steps</div>
        </div>
      </div>
    );
  }
  renderStepList() {
    const helper = this.getHelper();
    return (
      <StepList
        steps={helper.getOrderedSteps()}
        completed={helper.getCurrentStepIndex()}
      />
    );
  }
  render() {
    return (
      <div className="goal-side">
        {this.renderProgress()}
        {this.renderStepList()}
      </div>
    );
  }
}

export default GoalSide;

GoalSide.propTypes = {
  goal: map,
};
