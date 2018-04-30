import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { fromJS } from 'immutable';
import {
  bindAll,
  getParentByClass,
  truncateString,
} from 'swipes-core-js/classes/utils';
import {
  setupDelegate,
  setupCachedCallback
} from 'react-delegate';

import Icon from 'Icon';
import Button from 'Button';
import HOCAssigning from 'components/assigning/HOCAssigning';
import StepTooltip from './StepTooltip';
import SortableList from './SortableList';
import AutoCompleteInput from 'components/auto-complete-input/AutoCompleteInput';

import './styles/step-list.scss';

class StepList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addFocus: false,
      addStepValue: '',
      addStepAssignees: fromJS([]),
    };
    setupDelegate(this, 'onStepSort', 'onStepAdd', 'onStepRename', 'onChangingAdd');
    bindAll(this, ['onSortEnd', 'onFocus', 'onBlur', 'onChange', 'onKeyDown', 'onAddStep']);
    this.acOptions = {
      types: ['users'],
      delegate: this,
      trigger: "@",
    }
  }
  onAssign(i, e) {
    const options = this.getOptionsForE(e);
    const { selectAssignees } = this.props;
    const assignees = this.state.addStepAssignees;

    let overrideAssignees;
    options.onClose = () => {
      this.refs.addStepInput.refs.input.focus();
      if (overrideAssignees) {
        this.setState({ addStepAssignees: fromJS(overrideAssignees) });
      }
    }
    selectAssignees(options, assignees.toJS(), (newAssignees) => {
      if (newAssignees) {
        overrideAssignees = newAssignees;
      }
    });
    e.stopPropagation();
  }
  onAutoCompleteSelect(item) {
    let { addStepAssignees, addStepValue } = this.state;
    if (!addStepAssignees.contains(item.id)) {
      addStepAssignees = addStepAssignees.push(item.id);
    }
    const msgArr = addStepValue.split('@');
    addStepValue = msgArr.slice(0, -1).join('@');
    this.setState({ addStepValue, addStepAssignees });
  }
  onChange(e) {
    const value = e.target.value;
    this.setState({ addStepValue: value });
    this.onChangingAdd(value)
  }
  onKeyDown(e) {
    if (e.keyCode === 13 && e.target.value.length > 0) {

      this.onStepAdd(e.target.value, this.state.addStepAssignees.toJS());
      this.setState({
        addStepValue: '',
        addStepAssignees: fromJS([]),
      });
    }
  }
  onAddStep() {
    console.log('hi')
  }
  onFocus() {
    this.setState({ addFocus: true });
  }
  onBlur(i) {
    this.setState({ addFocus: false });
  }
  onSortStart() {
    document.body.classList.add("no-select");
  }
  onSortEnd(obj, e) {
    document.body.classList.remove("no-select");
    this.onStepSort(obj, e);
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
  }
  getPlaceholder() {
    let placeholder = 'What is the next step? Add it here...';
    const { stepOrder } = this.props;
    if (!stepOrder.size) {
      placeholder = 'What is the first step? Add it here...';
    }
    return placeholder;
  }
  getContainer(el) {
    return getParentByClass(el.refs.root, 'sw-view__scroll');
  }
  saveTitle(i) {
    const { stepOrder, steps } = this.props;
    const { stepTitles } = this.state;
    const step = steps.get(stepOrder.get(i));
    const title = stepTitles.get(step.get('id'));
    if (title && title.length && title !== step.get('title')) {
      this.onStepRename(i, title);
      this.setState({ stepTitles: stepTitles.remove(step.get('id')) });
    }
  }

  renderAddStep() {
    const { isLoading, getLoading, stepOrder } = this.props;
    const { addFocus, addStepValue, addStepAssignees } = this.state;

    let addClass = 'add-step';
    let value = addStepValue;

    if (isLoading('add')) {
      addClass += ' add-step--loading';
      value = getLoading('add').loading;
    }

    if (addStepValue.length && !isLoading('add')) {
      addClass += ' add-step--active'
    }

    if (addFocus || addStepValue.length) {
      addClass += ' add-step--focused';
    }

    const placeholder = this.getPlaceholder();

    return (
      <div className={addClass}>
        <AutoCompleteInput
          nodeType="input"
          ref="addStepInput"
          type="text"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          className="add-step__input"
          value={value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          placeholder={placeholder}
          options={this.acOptions}
        />
        <div className="add-step__indicator">
          <div className="add-step__indicator--number">{stepOrder.size + 1}</div>
        </div>
        <div className="add-step__assignees">
          <HOCAssigning
            index="add"
            assignees={addStepAssignees}
            delegate={this}
            rounded
            size={24}
          />
        </div>
        <div className="add-step__button">
          <Button icon="subdirectory_arrow_left" small frameless onClick={this.onAddStep} />
        </div>
      </div>
    );
  }

  render() {

    return (
      <div className="step-list">
        <SortableList
          lockAxis="y"
          distance={5}
          onSortStart={this.onSortStart}
          onSortEnd={this.onSortEnd}
          getContainer={this.getContainer}
          lockToContainerEdges
          helperClass="step-list-item__sortable"

          stepOrder={this.props.stepOrder}
          steps={this.props.steps}
          _loadingStates={this.props._loadingStates}
          getLoading={this.props.getLoading}
          isLoading={this.props.isLoading}
          delegate={this.props.delegate}
          editMode={this.props.editMode}
        />
        {this.renderAddStep()}
      </div>
    );
  }
}

export default StepList;
