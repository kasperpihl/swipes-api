import React, { Component, PropTypes } from 'react';
import { setupCachedCallback } from 'classes/utils';
import { list } from 'react-immutable-proptypes';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import './styles/handoff-status.scss';
/* global msgGen */

class HandoffStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onChange = setupCachedCallback(props.onChangeClick, this);
  }
  getHelper() {
    const { goal } = this.props;
    return new GoalsUtil(goal);
  }
  renderStatus() {
    const { toId, goal, assignees } = this.props;
    const helper = this.getHelper();
    let status = '';
    if (!helper.getIsStarted() && toId !== '_complete') {
      const i = helper.getStepIndexForId(toId) + 1;

      status = (
        <span>
          {`Start goal at step ${i} and assign it to `}
          <b onClick={this.onChange('assignees')}>{`"${msgGen.getUserArrayString(assignees, { yourself: true, number: 3 })}"`}</b>
        </span>
      );
    } else if (toId === '_complete') {
      status = (
        <span>
          {'Complete '}
          <b onClick={this.onChange('step')}>{`"${goal.get('title')}"`}</b>
        </span>
      );
    } else if (toId === '_notify' || toId === '_feedback') {
      status = (
        <span>
          {`${(toId === '_notify') ? 'Send notification' : 'Give feedback'} to `}
          <b onClick={this.onChange('assignees')}>{`"${msgGen.getUserArrayString(assignees, { yourself: true, number: 3 })}"`}</b>
        </span>
      );
    } else {
      const to = helper.getStepById(toId);
      const toIndex = helper.getStepIndexForId(toId);
      const numberOfCompleted = helper.getNumberOfCompletedSteps();
      const diff = toIndex - numberOfCompleted;

      const title = `"${to.get('title')}"`;
      let moveString = `Move ${diff} step${diff > 1 ? 's' : ''} forward to `;
      if (diff === 0) {
        moveString = 'Reassign ';
      }
      if (diff < 0) {
        moveString = 'Make iteration on ';
      }
      status = (
        <span>
          {moveString}
          <b onClick={this.onChange('step')}>{title}</b>
          {diff === 0 ? ' to ' : ' and assign '}
          <b onClick={this.onChange('assignees')}>{`"${msgGen.getUserArrayString(assignees, { yourself: true, number: 3 })}"`}</b>
        </span>
      );
    }

    return status;
  }
  render() {
    return (
      <div className="handoff-status">
        {this.renderStatus()}
      </div>
    );
  }
}

export default HandoffStatus;

const { object, func, string } = PropTypes;

HandoffStatus.propTypes = {
  onChangeClick: func,
  assignees: list,
  goal: object,
  toId: string,
};
