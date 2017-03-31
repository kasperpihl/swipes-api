import React, { PureComponent, PropTypes } from 'react';
import { list, map } from 'react-immutable-proptypes';
import {
  bindAll,
  setupCachedCallback,
  getParentByClass,
  setupDelegate,
  truncateString,
} from 'swipes-core-js/classes/utils';
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
    };
    this.tooltips = [];
    this.callDelegate = setupDelegate(props.delegate);
    this.onEnter = setupCachedCallback(this.onEnter, this);
    this.onKeyDownCached = setupCachedCallback(this.onKeyDown, this);
    this.onRemoveCached = setupCachedCallback(this.callDelegate.bind(null, 'onStepRemove'));
    bindAll(this, ['onLeave', 'onChange', 'onBlur', 'onFocus']);
    this.onCheck = setupCachedCallback(this.callDelegate.bind(null, 'onStepCheck'));
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
  onChange(e) {
    const value = e.target.value;
    this.setState({ addStepValue: value });
  }
  onKeyDown(i, e) {
    if (e.keyCode === 13 && e.target.value.length > 0) {
      this.callDelegate('onStepAdd', e.target.value);
      this.setState({ addStepValue: '' });
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
  onBlur() {
    this.setState({ addFocus: false });
  }
  getPlaceholder() {
    let placeholder = 'What is the next step? Add it here...';
    const { steps } = this.props;
    if (!steps.size) {
      placeholder = 'What is the first step? Enter it here...';
    }
    return placeholder;
  }
  renderEditStep(step, i) {
    const { delegate, loadingState } = this.props;
    let className = 'step-list-item step-list-item--editing';
    let title = step.get('title');

    if (loadingState.get(step.get('id')) && loadingState.get(step.get('id')).loading) {
      title = loadingState.get(step.get('id')).loadingLabel;
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
          defaultValue={title}
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
    const { currentStepIndex, delegate, steps, loadingState, editMode } = this.props;
    if (editMode) {
      return this.renderEditStep(step, i);
    }
    const completedI = currentStepIndex - 1;
    const { hoverIndex } = this.state;
    let hoverIcon = 'ActivityCheckmark';
    let className = 'step-list-item';

    let title = step.get('title');
    if (loadingState.get(step.get('id')) && loadingState.get(step.get('id')).loading) {
      title = loadingState.get(step.get('id')).loadingLabel;
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
    if (loadingState.get('completing') && loadingState.get('completing').loadingLabel) {
      const lI = parseInt(loadingState.get('completing').loadingLabel, 10);
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
        key={i}
        onMouseEnter={this.onEnter(i)}
        onMouseLeave={this.onLeave}
        onClick={this.onCheck(i)}
      >
        <div className="step-list-item__indicator">
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
    const { loadingState } = this.props;
    const { addFocus, addStepValue } = this.state;

    let addClass = 'add-step';
    let value = addStepValue;
    if (loadingState.get('add') && loadingState.get('add').loading) {
      addClass += ' add-step--loading';
      value = loadingState.get('add').loadingLabel;
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
    return (
      <div className="step-list">
        {steps.map((s, i) => this.renderStep(s, i))}
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
  loadingState: map,
};
