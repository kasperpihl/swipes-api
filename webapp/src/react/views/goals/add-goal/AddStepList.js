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
    this.onKeyDownCached = setupCachedCallback(this.onKeyDown, this);
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
  onKeyDown(i, e) {
    const { stepOrder } = this.props;
    if (e.keyCode === 8 && !e.target.value.length) {
      const isNotLast = i < stepOrder.size;
      if (isNotLast) {
        e.preventDefault();
        this.callDelegate('onDeletedStep', stepOrder.get(i));
        const prevInput = this.refs[`input${i - 1}`];
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
    if (e.keyCode === 13) {
      const isNotLast = i < stepOrder.size;
      if (isNotLast) {
        e.preventDefault();
        this.callDelegate('onAddedStep', '', i + 1);
        const nextInput = this.refs[`input${i + 1}`];
        if (nextInput) {
          nextInput.focus();
        }
      }
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
            rounded
          />
        </div>
      );
    }

    return (
      <div key={i} className={className}>
        <div className="step__header">
          <input
            onKeyDown={this.onKeyDownCached(i)}
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
      this.renderStep(stepOrder.size, Map({ title: '' })),
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
