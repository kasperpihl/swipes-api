import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import GoalsUtil from 'classes/goals-util';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import HOCAssigning from 'components/assigning/HOCAssigning';

import './styles/goal-list-item.scss';

class GoalListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.clickedListItem = this.clickedListItem.bind(this);
  }
  clickedListItem() {
    const { onClick, goal } = this.props;

    if (onClick) {
      onClick(goal.get('id'));
    }
  }
  renderProgressBar() {
    const { goal } = this.props;
    const helper = new GoalsUtil(goal);
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
  render() {
    const { goal, filter } = this.props;
    const status = msgGen.getGoalSubtitle(goal, filter);

    return (
      <div className="goal-list-item" onClick={this.clickedListItem}>
        <div className="goal-list-item__content">
          <div className="goal-list-item__title">{goal.get('title')}</div>
          <div className="goal-list-item__subtitle">
            <div className="goal-list-item__label">{status}</div>
            {this.renderProgressBar()}
          </div>
        </div>
        <div className="goal-list-item__assigning">
          <HOCAssigning
            stepId={goal.getIn(['status', 'current_step_id'])}
            goalId={goal.get('id')}
            maxImages={1}
          />
        </div>
      </div>
    );
  }
}

const { func } = PropTypes;

GoalListItem.propTypes = {
  goal: map,
  filter: map,
  onClick: func,
};

export default GoalListItem;
