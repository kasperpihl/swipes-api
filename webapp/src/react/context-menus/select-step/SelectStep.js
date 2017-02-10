import React, { PureComponent, PropTypes } from 'react';
import { listOf, mapContains } from 'react-immutable-proptypes';
import { setupCachedCallback, bindAll } from 'classes/utils';
import Icon from 'Icon';

import './styles/select-step.scss';

class SelectStep extends PureComponent {
  constructor(props) {
    super(props);
    this.onClickCached = setupCachedCallback(props.onClick, this);
  }
  componentDidMount() {
  }
  getNextStepNumber() {
    const { steps } = this.props;
    let number;

    steps.forEach((s, i) => {
      if (s.get('next')) {
        number = i;
      }
    });

    return number;
  }
  renderSteps() {
    const { numberOfCompleted, steps } = this.props;

    const stepsHTML = steps.map((s, i) => {
      let stepClass = 'step-item';
      let tooltipLabel = '';

      if (i < numberOfCompleted) {
        stepClass += ' step-item--completed';
        tooltipLabel = `Make iteration on step ${i + 1}`;
      } else if (i === numberOfCompleted) {
        stepClass += ' step-item--current';
        tooltipLabel = 'Reassign current step';
      } else {
        stepClass += ' step-item--future';
        const diff = i - numberOfCompleted;
        tooltipLabel = `Move ${diff} step${diff > 1 ? 's' : ''} forward`;
      }

      if (s.get('next')) {
        stepClass += ' step-item--active';
      }

      return (
        <div
          className={stepClass}
          data-id={i + 1}
          key={s.get('id')}
          onClick={this.onClickCached(s.get('id'), s)}
        >
          {s.get('title')}

          <div className="step-item__tooltip">{tooltipLabel}</div>
        </div>
      );
    });

    return stepsHTML;
  }
  render() {
    let completeClass = 'step-item step-item--complete';

    if (typeof this.getNextStepNumber() !== 'number') {
      completeClass += ' step-item--active';
    }

    return (
      <div className="step-selection-menu">
        <div className="step-selection-menu__list">
          {this.renderSteps()}
          <div className={completeClass} onClick={this.onClickCached(null)}>Complete goal</div>
        </div>
      </div>
    );
  }
}

export default SelectStep;

const { string, bool, func, number } = PropTypes;

SelectStep.propTypes = {
  onClick: func.isRequired,
  numberOfCompleted: number,
  steps: listOf(mapContains({
    id: string,
    title: string,
    current: bool,
    next: bool,
  })),
};
