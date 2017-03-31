import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import { list } from 'react-immutable-proptypes';
import HOCAssigning from 'components/assigning/HOCAssigning';
import {
  setupCachedCallback,
  setupDelegate,
  getParentByClass,
  bindAll,
  truncateString,
} from 'swipes-core-js/classes/utils';
import Icon from 'Icon';
import StepTooltip from './StepTooltip';

import './styles/step-list.scss';

class HOCStepList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hoverIndex: -1,
      addStepValue: '',
      addFocus: false,
    };
    this.tooltips = [];
    this.onEnter = setupCachedCallback(this.onEnter, this);
    bindAll(this, ['onLeave', 'onChange', 'addStep', 'onBlur', 'onFocus']);
    this.callDelegate = setupDelegate(props.delegate);
    this.onCheck = setupCachedCallback(this.callDelegate.bind(null, 'onStepCheck'));
    this.onClick = setupCachedCallback(this.callDelegate.bind(null, 'onStepClick'));
  }
  componentDidMount() {
  }
  componentWillUnmount() {
    const { tooltip } = this.props;
    tooltip(null);
  }
  onFocus() {
    this.setState({ addFocus: true });
  }
  onBlur() {
    this.setState({ addFocus: false });
  }
  onEnter(i, e) {
    const target = getParentByClass(e.target, 'step-list-item');

    if (target) {
      const tooltipText = this.tooltips[i];
      const { tooltip, tooltipAlign } = this.props;
      const position = tooltipAlign || 'right';

      const data = {
        component: StepTooltip,
        props: {
          tooltipText,
        },
        options: {
          boundingRect: target.getBoundingClientRect(),
          position,
        },
      };

      tooltip(data);
    }

    this.setState({
      hoverIndex: i,
    });
  }
  onLeave() {
    const { tooltip } = this.props;

    tooltip(null);

    this.setState({
      hoverIndex: -1,
    });
  }
  onChange(e) {
    const value = e.target.value;

    this.setState({ addStepValue: value });
  }
  getPlaceholder() {
    let placeholder = 'What is the next step? Add it here...';
    const { steps } = this.props;
    if (!steps.size) {
      placeholder = 'What is the first step? Enter it here...';
    }
    return placeholder;
  }
  addStep(e) {
    if (e.keyCode === 13 && e.target.value.length > 0) {
      this.callDelegate('onAddStep', e.target.value);
      this.setState({ addStepValue: '' });
    }
  }
  renderStep(step, i) {
    const { currentStepIndex, delegate, steps, loadingI } = this.props;
    const completedI = currentStepIndex - 1;
    const { hoverIndex } = this.state;
    let hoverIcon = 'ActivityCheckmark';
    let className = 'step-list-item';

    let title = step.get('title');
    if (step.get('loading')) {
      title = step.get('loading');
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
    if (typeof loadingI !== 'undefined') {
      const lI = parseInt(loadingI, 10);
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
    const { addLoading, editable } = this.props;
    const { addFocus, addStepValue } = this.state;

    if (!editable) {
      return undefined;
    }

    let addClass = 'add-step';

    if (addLoading && addLoading.loading) {
      addClass += ' add-step--loading';
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
          value={this.state.addStepValue}
          onChange={this.onChange}
          onKeyDown={this.addStep}
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

export default connect(null, {
  tooltip: a.main.tooltip,
})(HOCStepList);

const { string, number, object, bool, func } = PropTypes;

HOCStepList.propTypes = {
  steps: list,
  tooltip: func,
  currentStepIndex: number,
  delegate: object,
  addLoading: object,
  tooltipAlign: string,
};
