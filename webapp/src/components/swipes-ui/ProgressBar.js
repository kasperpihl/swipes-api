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
    const { activeIndex, steps } = this.props;
    const i = parseInt(e.target.getAttribute('data-index'));

    if (activeIndex !== i) {
      if(steps[i].disabled) return;
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
    const { steps, activeIndex, currentIndex } = this.props;
    const stepWidth = 100 / steps.length;
    let multiplier = currentIndex;

    if (steps.length == currentIndex + 1) {
      multiplier = currentIndex + 1
    }

    let styles = {
      WebkitClipPath: `polygon(0% 0, ${stepWidth * multiplier}% 0, ${stepWidth * multiplier}% 100%, 0% 100%)`
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
    const { activeIndex, currentIndex, steps } = this.props;
    let className = 'sw-progress-bar__step';

    if (i < currentIndex) {
      className += ' sw-progress-bar__step--completed'
    }

    if (i === currentIndex) {
      className += ' sw-progress-bar__step--current'
    }

    if (i === activeIndex) {
      className += ' sw-progress-bar__step--active'
    }

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
