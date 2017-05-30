import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { list, map } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import {
  bindAll,
  setupCachedCallback,
  getParentByClass,
  setupDelegate,
  truncateString,
} from 'swipes-core-js/classes/utils';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Icon from 'Icon';
import Button from 'Button';
import HOCAssigning from 'components/assigning/HOCAssigning';
import StepTooltip from './StepTooltip';

import './styles/step-list.scss';

class StepList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addFocus: false,
      addStepValue: '',
      hoverIndex: -1,
      stepTitles: fromJS({}),
    };
    this.tooltips = [];
    setupDelegate(this);
    this.callDelegate.bindAll('onStepSort');
    this.onEnter = setupCachedCallback(this.onEnter, this);
    this.onKeyDownCached = setupCachedCallback(this.onKeyDown, this);
    this.onChangeCached = setupCachedCallback(this.onChange, this);
    this.onBlurCached = setupCachedCallback(this.onBlur, this);
    this.onRemoveCached = setupCachedCallback(this.callDelegate.bind(null, 'onStepRemove'));
    this.onCheck = setupCachedCallback(this.callDelegate.bind(null, 'onStepCheck'));
    bindAll(this, ['onLeave', 'onFocus']);
  }
  componentDidMount() {
  }
  onChange(i, e) {
    const { steps, stepOrder } = this.props;
    const { stepTitles } = this.state;
    const value = e.target.value;
    if (i === 'add') {
      this.setState({ addStepValue: value });
    } else {
      const step = steps.get(stepOrder.get(i));
      this.setState({ stepTitles: stepTitles.set(step.get('id'), value) });
    }
  }
  onKeyDown(i, e) {
    if (e.keyCode === 13 && e.target.value.length > 0) {
      if (i === 'add') {
        this.callDelegate('onStepAdd', e.target.value);
        this.setState({ addStepValue: '' });
      } else {
        e.target.blur();
        this.saveTitle(i);
      }
    }
  }
  onFocus() {
    this.setState({ addFocus: true });
  }
  onBlur(i) {
    if (i === 'add') {
      this.setState({ addFocus: false });
    } else {
      this.saveTitle(i);
    }
  }
  getPlaceholder() {
    let placeholder = 'What is the next step? Add it here...';
    const { stepOrder } = this.props;
    if (!stepOrder.size) {
      placeholder = 'What is the first step? Enter it here...';
    }
    return placeholder;
  }
  saveTitle(i) {
    const { stepOrder, steps } = this.props;
    const { stepTitles } = this.state;
    const step = steps.get(stepOrder.get(i));
    const title = stepTitles.get(step.get('id'));
    if (title && title.length && title !== step.get('title')) {
      this.callDelegate('onStepRename', i, title);
      this.setState({ stepTitles: stepTitles.remove(step.get('id')) });
    }
  }
  renderEditStep(step, i) {
    const { delegate, getLoading } = this.props;
    const { stepTitles } = this.state;
    let className = 'step-list-item step-list-item--editing';
    let title = stepTitles.get(step.get('id')) || step.get('title');
    if (getLoading(step.get('id')).loading) {
      title = getLoading(step.get('id')).loadingLabel;
      className += ' step-list-item--loading';
    }

    return (
      <div className={className}>
        <div className="step-list-item__remove" >
          <Button
            icon="Trash"
            className="step-list-item__remove--button"
            onClick={this.onRemoveCached(i)}
          />
        </div>
        <input
          type="text"
          className="step-list-item__input"
          onKeyDown={this.onKeyDownCached(i)}
          onBlur={this.onBlurCached(i)}
          value={title}
          onChange={this.onChangeCached(i)}
          placeholder="Enter the step title"
        />
        <div className="step-list-item__assignees">
          <HOCAssigning
            delegate={delegate}
            index={i}
            assignees={step.get('assignees')}
            rounded
            size={24}
          />
        </div>
      </div>
    );
  }
  renderStep(step, i) {
    const { delegate, getLoading, isLoading, editMode } = this.props;
    if (editMode) {
      return this.renderEditStep(step, i);
    }

    let hoverIcon = 'ActivityCheckmark';
    let className = 'step-list-item';

    let title = step.get('title');
    if (isLoading(step.get('id'))) {
      title = getLoading(step.get('id')).loadingLabel;
      className += ' step-list-item--loading';
    }

    if(step.get('completed')) {
      className += ' step-list-item--completed';
    } else {
      className += ' step-list-item--current';
    }

    return (
      <div className={className} key={step.get('id')}>
        <div className="step-list-item__indicator" onClick={this.onCheck(i)}>
          <div className="indicator">
            <div className="indicator__number">{ i + 1 }</div>
            <div className="indicator__icon">
              <Icon icon={hoverIcon} className="indicator__svg" />
            </div>
          </div>
        </div>
        <div className="step-list-item__title">
          {title}
        </div>
        <div className="step-list-item__assignees">
          <HOCAssigning
            delegate={delegate}
            index={i}
            assignees={step.get('assignees')}
            rounded
            size={24}
          />
        </div>
      </div>
    );
  }
  renderAddStep() {
    const { isLoading, getLoading } = this.props;
    const { addFocus, addStepValue } = this.state;

    let addClass = 'add-step';
    let value = addStepValue;
    if (isLoading('add')) {
      addClass += ' add-step--loading';
      value = getLoading('add').loadingLabel;
    }
    if (addFocus || addStepValue.length) {
      addClass += ' add-step--focused';
    }
    const placeholder = this.getPlaceholder();

    return (
      <div className={addClass}>
        <input
          ref="addStepInput"
          type="text"
          onFocus={this.onFocus}
          onBlur={this.onBlurCached('add')}
          className="add-step__input"
          value={value}
          onChange={this.onChangeCached('add')}
          onKeyDown={this.onKeyDownCached('add')}
          placeholder={placeholder}
        />
        <div className="add-step__indicator">
          <div className="add-step__loader" />
        </div>
      </div>
    );
  }
  render() {
    const { stepOrder, steps } = this.props;
    const SortableItem = SortableElement(({step, i}) => this.renderStep(step, i));
    const SortableList = SortableContainer(({items}) => (
      <div key="work">
        {items.map((stepId, i) => (
          <SortableItem step={steps.get(stepId)} index={i} i={i} key={stepId} />
        )).toArray()}
      </div>

    ));
    return (
      <div className="step-list">
        <SortableList
          items={stepOrder}
          lockAxis="y"
          distance={5}
          onSortStart={() => {
            document.body.classList.add("no-select");
          }}
          onSortEnd={(obj, e) => {
            document.body.classList.remove("no-select");
            this.onStepSort(obj, e);
          }}
          shouldCancelStart={() => !!this.props.editMode}
          lockToContainerEdges
          helperClass="step-list-item__sortable"
        />
        {this.renderAddStep()}
      </div>
    );
  }
}

export default StepList;

const { func, number, object, bool } = PropTypes;

StepList.propTypes = {
  steps: map,
  stepOrder: list,
  editMode: bool,
  tooltip: func,
  delegate: object,
  currentStepIndex: number,
  getLoading: func,
  isLoading: func,
};
