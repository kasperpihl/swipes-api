import React, { PureComponent, PropTypes } from 'react';
import { listOf, mapContains } from 'react-immutable-proptypes';
import { setupCachedCallback, bindAll } from 'classes/utils';

import './styles/select-step.scss';

class SelectStep extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hoverItem: null,
    };
    this.onClickCached = setupCachedCallback(props.onClick, this);
    bindAll(this, ['handleMouseEnter', 'handleMouseLeave'], );
  }
  componentDidMount() {
  }
  handleMouseEnter(e) {
    const item = parseInt(e.target.getAttribute('data-id'), 10);

    this.setState({ hoverItem: item });
  }
  handleMouseLeave(e) {
    this.setState({ hoverItem: null });
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
  getProgressFill() {
    const { steps, numberOfCompleted } = this.props;
    const { hoverItem } = this.state;

    if (!hoverItem) {
      return (100 - ((this.getNextStepNumber() * 100) / steps.size));
    } else if (hoverItem > numberOfCompleted) {
      return (100 - (((hoverItem - 1) * 100) / steps.size));
    }

    return 0;
  }
  getNewFill() {
    const { steps, numberOfCompleted } = this.props;
    const { hoverItem } = this.state;
    console.log('hoverItem', hoverItem);
    if (hoverItem === 1) {
      return 97;
    }

    if (hoverItem < numberOfCompleted + 1) {
      return (100 - (((hoverItem - 1) * 100) / steps.size));
    }

    return 100;
  }
  renderProgress() {
    const { numberOfCompleted, steps } = this.props;
    const totalSteps = steps.size;
    const currentLength = 100 - ((numberOfCompleted * 100) / totalSteps);

    const currentStyle = {
      WebkitClipPath: `inset(0 ${currentLength}% 0 0)`,
    };
    const nextStyle = {
      WebkitClipPath: `inset(0 ${this.getProgressFill()}% 0 0 round 6px)`,
    };
    const newStyle = {
      WebkitClipPath: `inset(0 ${this.getNewFill()}% 0 0 round 6px)`,
    };
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
    return (
      <div className="step-selection-menu">
        {this.renderProgress()}
        <div className="step-selection-menu__list">
          {this.renderSteps()}
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
