import React, { Component, PropTypes } from 'react';
import { bindAll } from 'classes/utils';
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
    const { mainLabel, isSubmitting } = this.props;
    return (
      <Button
        text={mainLabel}
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

const { string, func, bool, object } = PropTypes;

GoalActions.propTypes = {
  isHandingOff: bool,
  isSubmitting: bool,
  mainLabel: string,
  onHandoff: func,
  onCancel: func,
  children: object,
};
