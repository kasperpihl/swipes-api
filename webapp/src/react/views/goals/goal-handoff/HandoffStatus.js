import React, { Component, PropTypes } from 'react';
import { setupCachedCallback } from 'classes/utils';
import { list } from 'react-immutable-proptypes';
import GoalsUtil from 'classes/goals-util';
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

    if (toId === '_complete') {
      status = (
        <span>
          {'Complete '}
          <b onClick={this.onChange('step')}>{`"${goal.get('title')}"`}</b>
        </span>
      );
    } else if (toId === '_notify') {
      status = (
        <span>
          {'Notify '}
          <b onClick={this.onChange('to')}>{`"${msgGen.getUserArrayString(assignees, { yourself: true })}"`}</b>
        </span>
      );
    } else {
      const to = helper.getStepById(toId);
      const toIndex = helper.getStepIndexForId(toId);
      const fromIndex = helper.getCurrentStepIndex();
      const diff = toIndex - fromIndex;

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
          <b onClick={this.onChange('to')}>{`"${msgGen.getUserArrayString(assignees, { yourself: true })}"`}</b>
        </span>
      );
    }

    return status;
  }
  render() {
    return (
      <div className="goal-actions__status">
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
