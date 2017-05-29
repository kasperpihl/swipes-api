import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { setupDelegate, bindAll, getParentByClass } from 'swipes-core-js/classes/utils';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import Icon from 'Icon';
import HOCAssigning from 'components/assigning/HOCAssigning';
import GoalItemTooltip from './GoalItemTooltip';

import './styles/goal-list-item.scss';
/* global msgGen */
class HOCGoalListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      animateToStarred: false,
    };
    setupDelegate(this, props.goalId);
    this.onClick = this.onClickItem.bind(this);
    bindAll(this, ['onEnter', 'onLeave', 'onPin']);
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  onEnter(e) {
    const { goal, tooltip } = this.props;
    const target = getParentByClass(e.target, 'goal-list-item__indicator');
    const tooltipText = goal.get('starred') ? 'Starred' : 'Star to prioritize';

    const data = {
      component: GoalItemTooltip,
      props: {
        tooltipText,
        goalId: goal.get('id'),
      },
      options: {
        boundingRect: target.getBoundingClientRect(),
        position: 'left',
      },
    };

    tooltip(data);
  }
  onLeave() {
    const { tooltip } = this.props;

    tooltip(null);
  }

  onClickItem() {
    const selection = window.getSelection();

    if (selection.toString().length === 0) {
      this.callDelegate('onGoalClick');
    }
  }
  onPin() {
    const { togglePinGoal, goal } = this.props;
    this.setState({ animateToStarred: true });
    const event = goal.get('pinned') ? 'Goal unpinned' : 'Goal pinned';
    togglePinGoal(goal.get('id')).then((res) => {
      if (res && res.ok) {
        window.analytics.sendEvent(event, {});
      }
      if (!this._unmounted) {
        this.setState({ animateToStarred: false });
      }
    });
  }
  getHelper() {
    const { goal } = this.props;
    return new GoalsUtil(goal);
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
  }
  renderIndicator() {
    return (
      <div className="goal-list-item__indicator" onClick={this.onPin} onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
        <div className="goal-list-item__dot" />
      </div>
    );
  }
  renderContent() {
    const { goal, filter } = this.props;
    const status = msgGen.goals.getListSubtitle(goal, filter);

    return (
      <div className="goal-list-item__content" onClick={this.onClick}>
        <div className="goal-list-item__title">{goal.get('title')}</div>
        <div className="goal-list-item__subtitle">
          <div className="goal-list-item__label">{status}</div>
          {/* this.renderProgressBar()*/}
        </div>
      </div>
    );
  }
  renderProgressBar() {
    const helper = this.getHelper();
    const numberOfCompletedSteps = helper.getNumberOfCompletedSteps();
    const numberOfAllSteps = helper.getNumberOfSteps();
    const completedProgressFill = (numberOfCompletedSteps * 100) / numberOfAllSteps;
    const styles = {
      width: `${completedProgressFill}%`,
    };

    if (!numberOfAllSteps) {
      return (
        <div className="progress-bar  progress-bar--empty">
          <div className="progress-bar__status">No steps added</div>
        </div>
      );
    }

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
    if (helper.getIsCompleted() || !helper.getNumberOfSteps()) {
      return undefined;
    }

    return (
      <div className="goal-list-item__assigning">
        <HOCAssigning
          assignees={helper.getAllAssignees()}
          maxImages={2}
          rounded
        />
      </div>
    );
  }
  render() {
    const { goal } = this.props;
    const { animateToStarred } = this.state;
    const helper = this.getHelper();
    const isActive = !helper.getIsCompleted();
    let className = 'goal-list-item';

    if (goal.get('starred')) {
      className += ' goal-list-item--starred';
    }

    if (!isActive) {
      className += ' goal-list-item--completed';
    }

    if (animateToStarred) {
      className += ' goal-list-item--to-starred';
    }

    return (
      <div className={className}>
        {this.renderIndicator()}
        {this.renderContent()}
        {this.renderAssignees()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  goal: state.getIn(['goals', ownProps.goalId]),
});

const { object } = PropTypes;

HOCGoalListItem.propTypes = {
  goal: map,
  delegate: object,
  filter: map,
};

export default connect(mapStateToProps, {
  selectAssignees: a.goals.selectAssignees,
  tooltip: a.main.tooltip,
  assignStep: ca.steps.assign,
  togglePinGoal: ca.me.togglePinGoal,
})(HOCGoalListItem);
