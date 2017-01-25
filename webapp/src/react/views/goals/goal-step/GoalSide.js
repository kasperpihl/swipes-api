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

  }
  renderStepList() {
    const { goal } = this.props;
    const helper = this.getHelper();
    return <StepList steps={helper.getOrderedSteps()} completed={1} />;
  }
  render() {
    console.log('props', this.props.goal.toJS());
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
