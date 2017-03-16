import React, { PureComponent, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import GoalsUtil from 'classes/goals-util';
import Icon from 'Icon';
import HOCAssigning from 'components/assigning/HOCAssigning';

import './styles/goal-list-item.scss';
/* global msgGen */
class GoalListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.clickedListItem = this.clickedListItem.bind(this);
  }
  getHelper() {
    const { goal } = this.props;
    return new GoalsUtil(goal);
  }
  clickedAssign(stepId, e) {
    const { onAssignClick, goal } = this.props;
    const helper = this.getHelper();

    if (onAssignClick) {
      onAssignClick(goal.get('id'), helper.getCurrentStepId(), e);
    }
  }
  clickedListItem() {
    const { onClick, goal } = this.props;

    if (onClick) {
      onClick(goal.get('id'));
    }
  }

  renderProgressBar() {
    const helper = this.getHelper();
    const numberOfCompletedSteps = helper.getNumberOfCompletedSteps();
    const numberOfAllSteps = helper.getTotalNumberOfSteps();
    const completedProgressFill = (numberOfCompletedSteps * 100) / numberOfAllSteps;
    const styles = {
      width: `${completedProgressFill}%`,
    };

    return (
      <div className="progress-bar">
        <div className="progress-bar__frame">
          <div className="progress-bar__fill" style={styles} />
        </div>
        <div className="progress-bar__status">{numberOfCompletedSteps} of {numberOfAllSteps} step{numberOfAllSteps > 1 ? 's' : ''} completed</div>
      </div>
    );
  }
  renderAssignees() {
    const { goal } = this.props;
    const helper = this.getHelper();
    if (helper.getIsCompleted() || !helper.getIsStarted()) {
      return undefined;
    }
    return (
      <div className="goal-list-item__assigning">
        <HOCAssigning
          index={helper.getCurrentStepId()}
          stepId={helper.getCurrentStepId()}
          goalId={goal.get('id')}
          maxImages={2}
          rounded
          delegate={this}
        />
      </div>
    );
  }
  render() {
    const { goal, filter } = this.props;
    const helper = this.getHelper();
    const status = msgGen.getGoalSubtitle(goal, filter);
    const isActive = !helper.getIsCompleted();
    let className = 'goal-list-item';

    if (!isActive) {
      className += ' goal-list-item--completed';
    }

    return (
      <div className={className} onClick={this.clickedListItem}>
        <Icon icon="Checkmark" className="goal-list-item__completed-icon" />
        <div className="goal-list-item__content">
          <div className="goal-list-item__title">{goal.get('title')}</div>
          <div className="goal-list-item__subtitle">
            <div className="goal-list-item__label">{status}</div>
            {this.renderProgressBar()}
          </div>
        </div>
        {this.renderAssignees()}
      </div>
    );
  }
}

const { func } = PropTypes;

GoalListItem.propTypes = {
  goal: map,
  filter: map,
  onAssignClick: func,
  onClick: func,
};

export default GoalListItem;
