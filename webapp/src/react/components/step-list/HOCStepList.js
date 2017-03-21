import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import { list } from 'react-immutable-proptypes';
import HOCAssigning from 'components/assigning/HOCAssigning';
import { setupCachedCallback, setupDelegate, getParentByClass } from 'classes/utils';
import StepTooltip from './StepTooltip';

import './styles/step-list.scss';

class HOCStepList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hoverIndex: -1,
      addStepValue: ''
    };
    this.onEnter = setupCachedCallback(this.onEnter, this);
    this.onLeave = this.onLeave.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addStep = this.addStep.bind(this);
    this.callDelegate = setupDelegate(props.delegate);
    this.onCheck = setupCachedCallback(this.callDelegate.bind(null, 'onStepCheck'));
    this.onClick = setupCachedCallback(this.callDelegate.bind(null, 'onStepClick'));
  }
  componentDidMount() {
  }
  onEnter(i, tooltipText, e) {
    const target = getParentByClass(e.target, 'step-list-item__indicator');

    if (target) {
      const { tooltip, tooltipAlign } = this.props;
      const position = tooltipAlign || 'left';

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
  addStep(e) {
    if (e.keyCode === 13 && e.target.value.length > 0) {
      this.callDelegate('onAddStep', e.target.value);
      this.setState({ addStepValue: '' });
    }
  }
  renderStep(step, i) {
    const { completed, delegate, steps, noActive } = this.props;
    const completedI = completed - 1;
    const { hoverIndex } = this.state;

    let className = 'step-list-item';

    if (i <= completedI) {
      className += ' step-list-item--completed';
    } else if (i === completed && !noActive) {
      className += ' step-list-item--current';
    } else {
      className += ' step-list-item--future';
    }


    if (hoverIndex !== -1) {
      if (hoverIndex > completedI) {
        if (i > completedI && i <= hoverIndex) {
          className += ' step-list-item--hover';
        }
      } else if (i <= completedI && i >= hoverIndex) {
        className += ' step-list-item--hover';
      }
    }

    let title = step.get('title');
    if (step.get('loading')) {
      title = step.get('loading');
      className += ' step-list-item--loading';
    }

    let tooltip = 'Make iteration to this step';
    if (i > completedI) {
      tooltip = 'Complete this step';
      if (i > completed) {
        tooltip = `Complete ${i - completedI} step${(i > (completedI + 1)) ? 's' : ''}`;
      }
      if (i === (steps.size - 1)) {
        tooltip = 'Complete goal';
      }
    }

    const { fullHover } = this.props;


    return (
      <div
        className={className}
        key={i}
        onMouseEnter={fullHover ? this.onEnter(i) : undefined}
        onMouseLeave={fullHover ? this.onLeave : undefined}
        onClick={this.onClick(i)}
      >
        <div
          className="step-list-item__indicator"
          onClick={this.onCheck(i)}
          onMouseEnter={fullHover ? undefined : this.onEnter(i, tooltip)}
          onMouseLeave={fullHover ? undefined : this.onLeave}
        >
          <div className="indicator">
            <div className="indicator__number">{i + 1}</div>
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
  render() {
    const { steps, addLoading } = this.props;
    let addClass = 'add-step';

    if (addLoading && addLoading.loading) {
      addClass += ' add-step--loading';
    }

    return (
      <div className="step-list">
        {steps.map((s, i) => this.renderStep(s, i))}
        <div className={addClass}>
          <input
            ref="addStepInput"
            type="text"
            className="add-step__input"
            value={this.state.addStepValue}
            onChange={this.onChange}
            onKeyDown={this.addStep}
            placeholder="Add new step"
          />
          <div className="add-step__indicator">
            <div className="add-step__loader"></div>
          </div>
        </div>
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
  noActive: bool,
  fullHover: bool,
  completed: number,
  delegate: object,
  addLoading: object,
  tooltipAlign: string,
};
