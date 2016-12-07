import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import HOCAssigning from 'components/assigning/HOCAssigning';
import { nearestAttribute } from 'classes/utils';
import './styles/goal-overview.scss';

class GoalOverview extends Component {
  constructor(props) {
    super(props);
    this.clickedStep = this.clickedStep.bind(this);
  }
  callDelegate(name) {
    const { delegate } = this.props;
    if (delegate && typeof delegate[name] === 'function') {
      return delegate[name](...[this].concat(Array.prototype.slice.call(arguments, 1)));
    }

    return undefined;
  }
  clickedStep(e) {
    const stepIndex = parseInt(nearestAttribute(e.target, 'data-index'), 10);
    this.callDelegate('goalOverviewClickedStep', stepIndex);
  }
  renderStepListItem(step, index, currentStepIndex) {
    const { goal } = this.props;
    const completed = step.get('completed');
    const title = step.get('title');
    let className = 'goal-overview__step';

    if (completed) {
      className += ' goal-overview__step--completed';
    }

    if (index === currentStepIndex) {
      className += ' goal-overview__step--current';
    }

    return (
      <div className={className} data-index={index} key={index} onClick={this.clickedStep}>
        <div className="goal-overview__step-status" />
        <div className="goal-overview__step-title">{index + 1}. {title}</div>
        <div className="goal-overview__assignees">
          <HOCAssigning goalId={goal.get('id')} stepIndex={index} />
        </div>
      </div>
    );
  }
  renderStepList() {
    const { goal } = this.props;
    const steps = goal.get('steps');
    const stepIndex = goal.get('currentStepIndex');
    return steps.map((step, i) => this.renderStepListItem(step, i, stepIndex));
  }
  render() {
    return (
      <div className="goal-overview">
        {this.renderStepList()}
      </div>
    );
  }
}

export default GoalOverview;

const { object } = PropTypes;
GoalOverview.propTypes = {
  goal: map,
  delegate: object,
};
