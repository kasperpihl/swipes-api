import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import Icon from 'Icon';
import HOCAssigning from 'components/assigning/HOCAssigning';

import './styles/goal-list-item.scss';
/* global msgGen */
class HOCGoalListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate, props.goalId);
    this.onClick = this.onClickItem.bind(this);
  }
  onAssign(id, e){
    const { goalId, selectAssignees, assignStep } = this.props;
    const helper = this.getHelper();
    const step = helper.getCurrentStep();
    e.stopPropagation();
    const options = this.getOptionsForE(e);
    options.actionLabel = 'Assign';
    if(step.get('assignees').size){
      options.actionLabel = 'Reassign';
    }
    let overrideAssignees;
    selectAssignees(options, step.get('assignees').toJS(), (newAssignees) => {
      if (newAssignees) {
        overrideAssignees = newAssignees;
      } else if (overrideAssignees) {
        assignStep(goalId, step.get('id'), overrideAssignees);
        console.log('lets do this!');
      }
    });
  }
  onClickItem() {
    const selection = window.getSelection();

    if (selection.toString().length === 0) {
      this.callDelegate('onGoalClick');
    }
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
  renderProgressBar() {
    const helper = this.getHelper();
    const numberOfCompletedSteps = helper.getNumberOfCompletedSteps();
    const numberOfAllSteps = helper.getTotalNumberOfSteps();
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
    if (helper.getIsCompleted() || !helper.getTotalNumberOfSteps()) {
      return undefined;
    }

    return (
      <div className="goal-list-item__assigning">
        <HOCAssigning
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
    const status = msgGen.goals.getSubtitle(goal, filter);
    const isActive = !helper.getIsCompleted();
    let className = 'goal-list-item';

    if (!isActive) {
      className += ' goal-list-item--completed';
    }

    return (
      <div className={className} onClick={this.onClick}>
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

const mapStateToProps = (state, ownProps) => ({
  goal: state.getIn(['goals', ownProps.goalId]),
})

const { object, string } = PropTypes;

HOCGoalListItem.propTypes = {
  goal: map,
  delegate: object,
};

export default connect(mapStateToProps, {
  selectAssignees: a.goals.selectAssignees,
  assignStep: ca.steps.assign,
})(HOCGoalListItem);
