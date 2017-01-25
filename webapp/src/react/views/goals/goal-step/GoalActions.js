import React, { Component, PropTypes } from 'react';
import { bindAll } from 'classes/utils';
import Button from 'Button';

import './styles/goal-actions.scss';

class GoalActions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
  renderStatus() {
    const { status, isHandingOff } = this.props;
    if (!status || !isHandingOff) {
      return undefined;
    }
    return (
      <div className="goal-actions__status">{status}</div>
    );
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
    const { isHandingOff } = this.props;
    const title = isHandingOff ? 'Complete Step' : 'Handoff';
    return (
      <Button
        text={title}
        primary
        onClick={this.onHandoff}
        className="goal-actions__handoff"
      />
    );
  }
  render() {
    return (
      <div className="goal-actions">
        {this.renderStatus()}
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
  status: string,
  onHandoff: func,
  onCancel: func,
};
