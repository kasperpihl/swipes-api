import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import { bindAll } from 'swipes-core-js/classes/utils';
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
    setupDelegate(this, 'onGoalClick').setGlobals(props.goalId);
    bindAll(this, ['onClick']);
  }
  onAssign(i, e) {
    const options = this.getOptionsForE(e);
    const { selectAssignees, assignGoal, goal } = this.props;

    let overrideAssignees;
    options.onClose = () => {
      if (overrideAssignees) {
        assignGoal(goal.get('id'), overrideAssignees).then((res) => {
          if(res.ok){
            window.analytics.sendEvent('Goal assigned', {
              'Number of assignees': overrideAssignees.length,
            });
          }
        });
      }
    }
    selectAssignees(options, goal.get('assignees').toJS(), (newAssignees) => {
      if (newAssignees) {
        overrideAssignees = newAssignees;
      }
    });
    e.stopPropagation();
  }
  onClick(e) {
    const selection = window.getSelection();

    if (selection.toString().length === 0) {
      this.onGoalClick(e);
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
  renderAssignees() {
    const { goal } = this.props;
    const helper = this.getHelper();

    if (helper.getIsCompleted()) {
      return undefined;
    }

    return (
      <HOCAssigning
        assignees={helper.getAssignees()}
        maxImages={1}
        delegate={this}
        rounded
        size={30}
      />
    );
  }
  renderMoveButton() {
    const { fromMilestone } = this.props;

    if (!fromMilestone) {
      return undefined;
    }

    return (
      <div className="goal-list-item__move">
        <Icon className="goal-list-item__move-svg" icon="ArrowRightLine" />
      </div>
    )
  }
  render() {
    const { goal, fromMilestone } = this.props;
    const helper = this.getHelper();
    const isActive = !helper.getIsCompleted();

    let className = 'goal-list-item';

    if (!isActive) {
      className += ' goal-list-item--completed';
    }

    if (fromMilestone && true) { // Needs a check if is in later already
      className += ' goal-list-item--move-to-later'
    }

    return (
      <div className={className}>
        <div className="goal-list-item__content" onClick={this.onClick}>
          <div className="goal-list-item__circle">
            <Icon className="goal-list-item__completed-svg" icon="ChecklistCheckmark" />
          </div>
          <div className="goal-list-item__title">{goal.get('title')}</div>
        </div>
        {/* {this.renderMoveButton()} */}
        <div className="goal-list-item__assigning">
          {this.renderAssignees()}
        </div>
      </div>
    );
  }
}

const { object } = PropTypes;

HOCGoalListItem.propTypes = {
  goal: map,
  delegate: object,
  filter: map,
};

const mapStateToProps = (state, ownProps) => ({
  goal: state.getIn(['goals', ownProps.goalId]),
});

export default connect(mapStateToProps, {
  selectAssignees: a.goals.selectAssignees,
  assignGoal: ca.goals.assign,
})(HOCGoalListItem);
