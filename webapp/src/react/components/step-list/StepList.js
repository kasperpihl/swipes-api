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
  componentWillUnmount() {
    const { tooltip } = this.props;
    tooltip(null);
  }
  onEnter(i, e) {
    const target = getParentByClass(e.target, 'step-list-item');

    if (target) {
      const tooltipText = this.tooltips[i];
      const { tooltip } = this.props;

      const data = {
        component: StepTooltip,
        props: {
          tooltipText,
        },
        options: {
          boundingRect: target.getBoundingClientRect(),
          position: 'right',
        },
      };

      tooltip(data);
    }

    this.setState({
      hoverIndex: i,
    });
  }
  onChange(i, e) {
    const { steps } = this.props;
    const { stepTitles } = this.state;
    const value = e.target.value;
    if (i === 'add') {
      this.setState({ addStepValue: value });
    } else {
      const step = steps.get(i);
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
  onLeave() {
    const { tooltip } = this.props;

    tooltip(null);

    this.setState({
      hoverIndex: -1,
    });
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
    const { steps } = this.props;
    if (!steps.size) {
      placeholder = 'What is the first step? Enter it here...';
    }
    return placeholder;
  }
  saveTitle(i) {
    const { steps } = this.props;
    const { stepTitles } = this.state;
    const step = steps.get(i);
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
      <div
        className={className}
        key={i}
      >
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
    const { currentStepIndex, delegate, steps, getLoading, isLoading, editMode } = this.props;
    if (editMode) {
      return this.renderEditStep(step, i);
    }
    const completedI = currentStepIndex - 1;
    const { hoverIndex } = this.state;
    let hoverIcon = 'ActivityCheckmark';
    let className = 'step-list-item';

    let title = step.get('title');
    if (isLoading(step.get('id'))) {
      title = getLoading(step.get('id')).loadingLabel;
      className += ' step-list-item--loading';
    }

    let tooltip;
    if (i <= completedI) {
      tooltip = `Go back to "${truncateString(step.get('title'), 19)}"`;
      className += ' step-list-item--completed';
      hoverIcon = 'Iteration';
    } else if (i === currentStepIndex) {
      tooltip = `Complete "${truncateString(step.get('title'), 19)}"`;
      className += ' step-list-item--current';
    } else {
      tooltip = `Complete ${i - completedI} steps`;
      className += ' step-list-item--future';
      if (i === steps.size - 1) {
        tooltip = 'Complete goal';
      }
    }
    this.tooltips[i] = tooltip;
    if (getLoading('completing').loadingLabel) {
      const lI = parseInt(getLoading('completing').loadingLabel, 10);
      if (lI < currentStepIndex) {
        if (i < currentStepIndex && i >= lI) {
          title = 'Going back...';
          className += ' step-list-item--hover';
        }
      } else if (i >= currentStepIndex && i <= lI) {
        title = 'Completing...';
        className += ' step-list-item--hover';
      }
    }

    if (hoverIndex !== -1) {
      if (hoverIndex >= currentStepIndex) {
        if (i >= currentStepIndex && i <= hoverIndex) {
          className += ' step-list-item--hover';
        }
      } else if (i < currentStepIndex && i >= hoverIndex) {
        className += ' step-list-item--hover';
      }
    }


    return (
      <div
        className={className}
        key={step.get('id')}
      >
        <div
          className="step-list-item__indicator"
          onMouseEnter={this.onEnter(i)}
          onMouseLeave={this.onLeave}
          onClick={this.onCheck(i)}
        >
          <div className="indicator">
            <div className="indicator__number">{i + 1}</div>
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
    const { steps } = this.props;
    const SortableItem = SortableElement(({step, i}) => this.renderStep(step, i));
    const SortableList = SortableContainer(({items}) => (
      <div>
        {items.map((step, i) => (
          <SortableItem step={step} index={i} i={i} key={step.get('id')} />
        )).toArray()}
      </div>

    ));

    return (
      <div className="step-list">
        <SortableList
          items={steps}
          lockAxis="y"
        />
        {this.renderAddStep()}
      </div>
    );
  }
}

export default StepList;

const { func, number, object, bool } = PropTypes;

StepList.propTypes = {
  steps: list,
  editMode: bool,
  tooltip: func,
  delegate: object,
  currentStepIndex: number,
  getLoading: func,
  isLoading: func,
};
