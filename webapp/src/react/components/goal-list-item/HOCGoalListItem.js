import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { setupDelegate, bindAll } from 'swipes-core-js/classes/utils';
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

  renderAssignees() {
    const { goal } = this.props;
    const helper = this.getHelper();
    if (helper.getIsCompleted()) {
      return undefined;
    }

    return (
      <HOCAssigning
        assignees={helper.getAllAssignees()}
        maxImages={2}
        rounded
      />
    );
  }
  render() {
    const { goal } = this.props;

    const helper = this.getHelper();
    const isActive = !helper.getIsCompleted();

    let className = 'goal-list-item';

    if (!isActive) {
      className += ' goal-list-item--completed';
    }

    return (
      <div className={className}>
        <div className="goal-list-item__content" onClick={this.onClick}>
          <div className="goal-list-item__circle" />
          <div className="goal-list-item__title">{goal.get('title')}</div>
        </div>
        <div className="goal-list-item__assigning">
          {this.renderAssignees()}
        </div>
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
})(HOCGoalListItem);
