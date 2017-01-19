import React, { Component, PropTypes } from 'react';
import { setupCachedCallback, setupDelegate } from 'classes/utils';

import { List, fromJS, Map } from 'immutable';
import { list } from 'react-immutable-proptypes';
import HOCAssigning from 'components/assigning/HOCAssigning';

import './styles/add-goal-list';

// now use events as onClick: this.onChangeCached(i)
class AddGoalList extends Component {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
    this.onChangeCached = setupCachedCallback(this.onChange, this);
  }
  componentDidMount() {
  }
  onChange(i, e) {
    const { steps } = this.props;
    const newText = e.target.value;
    if (i === steps.size) {
      this.callDelegate('onAddedStep', fromJS({
        text: newText,
        assignees: [],
      }));
    } else {
      this.callDelegate('onUpdatedStepText', i, newText);
    }
  }
  renderStep(i, step) {
    const { steps, delegate } = this.props;
    const isLast = steps.size === i;
    let className = 'step';
    let assigneesHtml;

    if (isLast) {
      className += ' step--last';
    } else {
      assigneesHtml = (
        <HOCAssigning
          assignees={step.get('assignees').toJS()}
          index={i}
          delegate={delegate}
        />
      );
    }

    return (
      <div key={i} className={className}>
        <div className="step__header">
          <input
            className="step__title"
            placeholder={'Add Step'}
            value={step.get('text')}
            onChange={this.onChangeCached(i)}
          />
          {assigneesHtml}
        </div>
      </div>
    );
  }
  renderSteps() {
    const { steps } = this.props;
    let renderedSteps = steps.map((f, i) => this.renderStep(i, f));
    const lStep = steps.size ? steps[steps.size - 1] : null;
    if (!lStep || !lStep.get('text') || !lStep.get('text').length) {
      renderedSteps = renderedSteps.concat([
        this.renderStep(steps.size, Map({ text: '' })),
      ]);
    }
    return renderedSteps;
  }
  render() {
    return (
      <div className="add-goal__list">
        {this.renderSteps()}
      </div>
    );
  }
}

export default AddGoalList;

const { object } = PropTypes;

AddGoalList.propTypes = {
  steps: list,
  delegate: object,
};
