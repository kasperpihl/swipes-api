import React, { Component, PropTypes } from 'react';
import { setupCachedCallback, setupDelegate } from 'classes/utils';

import { Map } from 'immutable';
import { list, map } from 'react-immutable-proptypes';
import HOCAssigning from 'components/assigning/HOCAssigning';

import './styles/add-step-list';

// now use events as onClick: this.onChangeCached(i)
class AddStepList extends Component {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
    this.onChangeCached = setupCachedCallback(this.onChange, this);
  }
  componentDidMount() {
  }
  stepForIndex(i) {
    const { steps, stepOrder } = this.props;
    return steps.get(stepOrder.get(i));
  }
  onChange(i, e) {
    const { stepOrder, steps } = this.props;
    const stepId = stepOrder.get(i);
    const title = e.target.value;

    // Assigning HACK!
    let wasAt = false;
    const oldTitle = steps.getIn([stepId, 'title']);
    if (title.slice(-1) === '@' && (!oldTitle || title.length > oldTitle.length)) {
      wasAt = true;
    }
    // Hack end

    if (i === stepOrder.size) {
      this.callDelegate('onAddedStep', title);
    } else if (wasAt) {
      this.callDelegate('onOpenAssignee', stepId, e);
    } else {
      this.callDelegate('onUpdatedStepTitle', stepId, title);
    }
  }
  renderStep(i, step) {
    const { stepOrder, delegate } = this.props;
    const isLast = stepOrder.size === i;
    let className = 'step';
    let assigneesHtml;

    if (isLast) {
      className += ' step--last';
    } else {
      assigneesHtml = (
        <div className="step__assignees">
          <HOCAssigning
            assignees={step.get('assignees').toJS()}
            index={step.get('id')}
            delegate={delegate}
          />
        </div>
      );
    }

    return (
      <div key={i} className={className}>
        <div className="step__header">
          <input
            ref={`input${i}`}
            className="step__title"
            placeholder={'Add a Step'}
            value={step.get('title')}
            onChange={this.onChangeCached(i)}
          />
          <div className="step__input-border" />
          {assigneesHtml}
        </div>
      </div>
    );
  }
  renderSteps() {
    const { stepOrder, steps } = this.props;
    let renderedSteps = stepOrder.map((sId, i) => this.renderStep(i, steps.get(sId)));
    renderedSteps = renderedSteps.concat([
      this.renderStep(steps.size, Map({ title: '' })),
    ]);

    return renderedSteps;
  }
  render() {
    return (
      <div className="add-step__list">
        {this.renderSteps()}
      </div>
    );
  }
}

export default AddStepList;

const { object } = PropTypes;

AddStepList.propTypes = {
  steps: map,
  stepOrder: list,
  delegate: object,
};
