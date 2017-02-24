import React, { PureComponent, PropTypes } from 'react';
import { list } from 'react-immutable-proptypes';
import HOCAssigning from 'components/assigning/HOCAssigning';
import { setupCachedCallback } from 'classes/utils';
import Icon from 'Icon';

import './styles/step-list.scss';

class StepList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hoverIndex: -1,
    };
    this.onEnterCached = setupCachedCallback(this.onEnter, this);
    this.onLeaveCached = setupCachedCallback(this.onLeave, this);
  }
  componentDidMount() {
  }
  onEnter(i) {
    this.setState({
      hoverIndex: i,
    });
  }
  onLeave(i) {
    this.setState({
      hoverIndex: -1,
    });
  }
  renderStep(step, i) {
    const { completed } = this.props;
    const { hoverIndex } = this.state;

    let className = 'step-list-item';

    if (i < completed) {
      className += ' step-list-item--completed';
    } else if (i === completed) {
      className += ' step-list-item--current';
    } else {
      className += ' step-list-item--future';
    }
    if (hoverIndex !== -1) {
      const completedI = completed - 1;
      if (hoverIndex > completedI) {
        if (i > completedI && i <= hoverIndex) {
          className += ' step-list-item--hover';
        }
      } else if (i <= completedI && i >= hoverIndex) {
        className += ' step-list-item--hover';
      }
    }


    return (
      <div
        className={className}
        key={i}
        onMouseEnter={this.onEnterCached(i)}
        onMouseLeave={this.onLeaveCached(i)}
      >
        <div className="step-list-item__tooltip">Reassign current step</div>
        <div className="step-list-item__indicator">
          <div className="step-list-item__icon">
            <Icon svg="Checkmark" className="step-list-item__svg" />
          </div>
        </div>
        <div className="step-list-item__title">
          {step.get('title')}
        </div>
        <div className="step-list-item__assignees">
          <HOCAssigning assignees={step.get('assignees')} rounded size={24} />
        </div>
      </div>
    );
  }
  render() {
    const { steps } = this.props;

    return (
      <div className="step-list">
        {steps.map((s, i) => this.renderStep(s, i))}
      </div>
    );
  }
}

export default StepList;

const { number } = PropTypes;

StepList.propTypes = {
  steps: list,
  completed: number,
};
