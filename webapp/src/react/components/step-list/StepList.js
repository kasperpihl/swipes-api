import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
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
import { SortableElement } from 'react-sortable-hoc';
import Icon from 'Icon';
import Button from 'Button';
import HOCAssigning from 'components/assigning/HOCAssigning';
import StepTooltip from './StepTooltip';
import SortableList from './SortableList';

import './styles/step-list.scss';

class StepList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addFocus: false,
      addStepValue: '',
    };
    setupDelegate(this);
    this.callDelegate.bindAll('onStepSort');
    bindAll(this, ['onSortEnd', 'onFocus', 'onBlur', 'onChange', 'onKeyDown']);
  }
  componentDidMount() {
  }
  onChange(e) {
    const value = e.target.value;
    this.setState({ addStepValue: value });
  }
  onKeyDown(e) {
    if (e.keyCode === 13 && e.target.value.length > 0) {
      this.callDelegate('onStepAdd', e.target.value);
      this.setState({ addStepValue: '' });
    }
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
  getPlaceholder() {
    let placeholder = 'What is the next step? Add it here...';
    const { stepOrder } = this.props;
    if (!stepOrder.size) {
      placeholder = 'What is the first step? Enter it here...';
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
      this.callDelegate('onStepRename', i, title);
      this.setState({ stepTitles: stepTitles.remove(step.get('id')) });
    }
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
          onBlur={this.onBlur}
          className="add-step__input"
          value={value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          placeholder={placeholder}
        />
        <div className="add-step__indicator">
          <div className="add-step__loader" />
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
