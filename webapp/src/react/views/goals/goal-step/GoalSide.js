import React, { Component, PropTypes } from 'react';
import { setupDelegate } from 'classes/utils';
import StepList from 'components/step-list/StepList';
import { map } from 'react-immutable-proptypes';
import GoalsUtil from 'classes/goals-util';
import Icon from 'Icon';

class GoalSide extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate);
    this.onClick = this.callDelegate.bind(null, 'onAddStep');
  }
  getHelper() {
    const { goal } = this.props;
    return new GoalsUtil(goal);
  }
  renderProgress() {
    const helper = this.getHelper();
    const numberOfCompleted = helper.getNumberOfCompletedSteps();
    const totalSteps = helper.getTotalNumberOfSteps();
    const styles = {};

    const progressLength = 100 - ((numberOfCompleted * 100) / totalSteps);
    styles.WebkitClipPath = `inset(0 ${Math.min(97, progressLength)}% 0 0)`;

    return (
      <div className="goal-side__progress-bar">
        <div className="progress-bar">
          <div className="progress-bar__fill" style={styles} />
          <div className="progress-bar__status">{numberOfCompleted}/{totalSteps} Steps</div>
        </div>
      </div>
    );
  }
  renderStepList() {
    const helper = this.getHelper();
    const { loadingSteps } = this.props;
    return (
      <StepList
        steps={helper.getOrderedSteps().map(s => s.set('loading', loadingSteps.get(s.get('id'))))}
        completed={helper.getCurrentStepIndex()}
        delegate={this.props.delegate}
      />
    );
  }
  renderAddStep() {
    return (
      <div className="add-step">
        <div className="add-step__icon">
          <Icon svg="Plus" className="add-step__svg" />
        </div>
        <button className="add-step__text" onClick={this.onClick}>Add new step</button>
      </div>
    );
  }
  render() {
    return (
      <div className="goal-side">
        {this.renderProgress()}
        {this.renderStepList()}
        {this.renderAddStep()}
      </div>
    );
  }
}

export default GoalSide;

const { object } = PropTypes;

GoalSide.propTypes = {
  goal: map,
  delegate: object,
  loadingSteps: map,
};
