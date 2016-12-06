import React, { Component } from 'react';
import { map } from 'react-immutable-proptypes';
import Assign from 'components/assigning/Assigning';
import './styles/goal-overview.scss';

class GoalOverview extends Component {
  renderProgressBar() {
    const { goal } = this.props;
    const numberOfSteps = goal.get('steps').size;
    const numberOfCompletedSteps = goal.get('currentStepIndex');
    const completedPercentage = Math.min(99, 100 - ((100 / numberOfSteps) * numberOfCompletedSteps));
    const completedClipping = {
      WebkitClipPath: `inset(0 ${completedPercentage}% 0 0 round 3px)`,
    };

    return (
      <div className="progress-bar">
        <div className="progress-bar__progress" style={completedClipping} />
      </div>
    );
  }
  renderStepListItem(completed, title, assignees, index, currentStepIndex) {
    let className = 'goal-overview__step';

    if (completed) {
      className += ' goal-overview__step--completed';
    }

    if (index === currentStepIndex) {
      className += ' goal-overview__step--current';
    }

    return (
      <div className={className} key={index}>
        <div className="goal-overview__step-status" />
        <div className="goal-overview__step-title">{index + 1}. {title}</div>
        <div className="goal-overview__assignees">
          <Assign assignees={assignees.toJS()} />
        </div>
      </div>
    );
  }
  renderStepList() {
    const { goal } = this.props;
    const steps = goal.get('steps');
    const currentStepIndex = goal.get('currentStepIndex');
    const renderStepsHTML = steps.map((step, i) => this.renderStepListItem(step.get('completed'), step.get('title'), step.get('assignees'), i, currentStepIndex));

    return renderStepsHTML;
  }
  render() {
    return (
      <div className="goal-overview">
        {this.renderProgressBar()}
        {this.renderStepList()}
      </div>
    );
  }
}

export default GoalOverview;

GoalOverview.propTypes = {
  goal: map,
};
