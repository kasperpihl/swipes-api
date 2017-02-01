import React, { Component, PropTypes } from 'react';
import { bindAll } from 'classes/utils';
import { map } from 'react-immutable-proptypes';
import Button from 'Button';

import './styles/goal-actions.scss';

class GoalActions extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ['onHandoff', 'onCancel']);
  }
  componentDidMount() {
  }
  onHandoff(e) {
    const { onHandoff } = this.props;
    if (onHandoff) {
      onHandoff(e);
    }
  }
  onCancel(e) {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel(e);
    }
  }
  renderCancel() {
    const { isHandingOff } = this.props;
    if (!isHandingOff) {
      return undefined;
    }
    return (
      <Button
        text="Cancel"
        onClick={this.onCancel}
        className="goal-actions__cancel"
      />
    );
  }
  renderHandoff() {
    const { isHandingOff, isCompletingGoal, isSubmitting } = this.props;
    let title = 'Handoff';
    if (isHandingOff) {
      title = isCompletingGoal ? 'Complete Goal' : 'Complete Step';
    }
    return (
      <Button
        text={title}
        loading={isSubmitting}
        primary
        onClick={this.onHandoff}
        className="goal-actions__handoff"
      />
    );
  }
  render() {
    const { children } = this.props;
    return (
      <div className="goal-actions">
        {children}
        {this.renderCancel()}
        {this.renderHandoff()}
      </div>
    );
  }
}

export default GoalActions;

const { string, func, bool } = PropTypes;

GoalActions.propTypes = {
  isHandingOff: bool,
  isSubmitting: bool,
  isCompletingGoal: bool,
  onHandoff: func,
  onCancel: func,
};
