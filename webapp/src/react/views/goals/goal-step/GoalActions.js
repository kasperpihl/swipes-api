import React, { Component, PropTypes } from 'react';
import { setupDelegate, bindAll } from 'classes/utils';
import Button from 'Button';

class GoalActions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate, this);
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
    const { status, showHandoff } = this.props;
    if (!status || !showHandoff) {
      return undefined;
    }
    return (
      <div>{status}</div>
    );
  }
  renderCancel() {
    const { showHandoff } = this.props;
    if (!showHandoff) {
      return undefined;
    }
    return (
      <Button
        text="Cancel"
        onClick={this.onCancel}
      />
    );
  }
  renderHandoff() {
    const { showHandoff } = this.props;
    const title = showHandoff ? 'Complete Step' : 'Handoff';
    return (
      <Button
        text={title}
        primary
        onClick={this.onHandoff}
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
  showHandoff: bool,
  status: string,
  onHandoff: func,
  onCancel: func,
};
