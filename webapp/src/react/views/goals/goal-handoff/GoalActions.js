import React, { Component, PropTypes } from 'react';
import { setupDelegate } from 'classes/utils';
import Button from 'Button';

import './styles/goal-actions.scss';

class GoalActions extends Component {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
    this.onPrimary = this.callDelegate.bind(null, 'onGoalAction', 'primary');
    this.onSecondary = this.callDelegate.bind(null, 'onGoalAction', 'secondary');
  }
  componentDidMount() {
  }
  renderSecondary() {
    const { secondaryLabel } = this.props;
    if (!secondaryLabel) {
      return undefined;
    }
    return (
      <Button
        text={secondaryLabel}
        onClick={this.onSecondary}
        className="goal-actions__secondary"
      />
    );
  }
  renderPrimary() {
    const { primaryLabel, primaryLoading } = this.props;
    return (
      <Button
        text={primaryLabel}
        loading={primaryLoading}
        primary
        onClick={this.onPrimary}
        className="goal-actions__primary"
      />
    );
  }
  render() {
    const { children } = this.props;
    return (
      <div className="goal-actions">
        {children}
        {this.renderSecondary()}
        {this.renderPrimary()}
      </div>
    );
  }
}

export default GoalActions;

const { string, bool, object, element } = PropTypes;

GoalActions.propTypes = {
  primaryLoading: bool,
  primaryLabel: string,
  secondaryLabel: string,
  delegate: object,
  children: element,
};
