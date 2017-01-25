import React, { Component, PropTypes } from 'react';
import StepList from 'components/step-list/StepList';
import { map } from 'react-immutable-proptypes';

class GoalSide extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderProgress() {

  }
  renderStepList() {
    const { goal } = this.props;
    return <StepList steps={goal.get('steps')} completed={1} />;
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
