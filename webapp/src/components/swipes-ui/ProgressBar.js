import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import { bindAll } from '../../classes/utils'

import './styles/progress-bar.scss'

class ProgressBar extends Component {
  constructor(props) {
    super(props)

    bindAll(this, ['onChange']);
  }
  onChange(e) {
    const { activeIndex } = this.props;
    const i = parseInt(e.target.getAttribute('data-index'));

    if (activeIndex !== i) {
      const { onChange } = this.props;

      if (onChange) {
        onChange(i);
      }
    }
  }
  renderSlope(svg){
    const Comp = Icons[svg];

    if (Comp) {
      return <Comp className="sw-progress-bar__slope-svg"/>;
    }
  }
  renderSteps() {
    const { steps } = this.props;
    const stepWidth = 100 / steps.length;
    let lastCompletedStep = -1;

    for (var i = 0; i < steps.length; i++) {
      if (steps[i].completed) {
        lastCompletedStep = i;
      } else {
        break;
      }
    }

    let styles = {
      WebkitClipPath: `polygon(0% 0, ${stepWidth * (lastCompletedStep + 1)}% 0, ${stepWidth * (lastCompletedStep + 1)}% 100%, 0% 100%)`
    };

    const stepsHTML = steps.map( (step, i) => {
      return this.renderStep(step, i, steps.length - 1)
    })

    return (
      <div className="sw-progress-bar__step-holder">
        <div className="sw-progress-bar__line sw-progress-bar__line--base"></div>
        <div className="sw-progress-bar__line sw-progress-bar__line--completed" style={styles}></div>

        {stepsHTML}
      </div>
    )
  }
  renderStep(step, i, lastStep) {
    const { activeIndex, steps } = this.props;
    let className = 'sw-progress-bar__step';

    if (step.completed) {
      className += ' sw-progress-bar__step--completed'
    }

    if (i === activeIndex) {
      className += ' sw-progress-bar__step--active'
    }

    // K_TODO: Fix knowing future steps
    if (step.disabled) {
      className += ' sw-progress-bar__step--disabled'
    }

    if (i === lastStep) {
      className += ' sw-progress-bar__step--last-step'
    }

    return (
      <div className={className} data-index={i} key={'step-' + i} data-title={`${i + 1}. ${step.title}`} onClick={this.onChange}></div>
    )
  }
  renderIteration() {
    const { title } = this.props;

    return (
      <div className="sw-progress-bar__slope">
        {this.renderSlope('ProgressBarSlope')}
        <div className="sw-progress-bar__iteration">{title}</div>
      </div>
    )
  }
  render() {
    return (
      <div className="sw-progress-bar">
        {this.renderSteps()}
        {this.renderIteration()}
      </div>
    )
  }
}

export default ProgressBar

const { arrayOf, bool, shape, string, number } = PropTypes;

ProgressBar.propTypes = {
  steps: arrayOf(shape({
    title: string,
    completed: bool
  })),
  stepIndex: number,
  title: string
}
