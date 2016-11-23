import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import { bindAll } from '../../classes/utils'

import './styles/progress-bar.scss'

class ProgressBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIndex: props.currentStepIndex || 0
    }

    bindAll(this, ['onChange']);
  }
  componentWillReceiveProps(nextProps){
    if(this.props.currentStepIndex !== nextProps.currentStepIndex){
      this.setState({activeIndex: nextProps.currentStepIndex});
    }
  }
  onChange(e) {
    const { activeIndex } = this.state;
    const i = parseInt(e.target.getAttribute('data-index'));
    if (activeIndex !== i) {
      const { onChange } = this.props;
      if(onChange){
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
    const { activeIndex } = this.state;
    const stepsLength = steps.length;
    const singleClip = 100 / stepsLength;
    let lastCompletedStep = 0;

    for (var i = 0; i < steps.length; i++) {
      if (steps[i].completed) {
        lastCompletedStep = i;
      }

      break;
    }

    let styles = {
      WebkitClipPath: `polygon(0% 0, ${singleClip * (lastCompletedStep + 1)}% 0, ${singleClip * (lastCompletedStep + 1)}% 100%, 0% 100%)`
    };

    const stepsHTML = steps.map( (step, i) => {
      return this.renderStep(step, i)
    })

    return (
      <div className="sw-progress-bar__step-holder">
        <div className="sw-progress-bar__line sw-progress-bar__line--base"></div>
        <div className="sw-progress-bar__line sw-progress-bar__line--completed" style={styles}></div>

        {stepsHTML}
      </div>
    )
  }
  renderStep(step, i) {
    const { activeIndex } = this.state;
    const { currentStepIndex } = this.props;
    let className = 'sw-progress-bar__step';

    if (step.completed) {
      className += ' sw-progress-bar__step--completed'
    }

    if (i === activeIndex) {
      className += ' sw-progress-bar__step--active'
    }

    if (i === currentStepIndex) {
      className += ' sw-progress-bar__step--disabled'
    }

    // return (
    //   <div className={className} data-index={i} data-attr={`${i + 1} ${step.title}`} key={`progress-step-${i}`} onClick={this.onChange}></div>
    // )

    return (
      <div className={className} key={'step-' + i}></div>
    )
  }
  renderInteration() {

    return (
      <div className="sw-progress-bar__slope">
        {this.renderSlope('ProgressBarSlope')}
      </div>
    )
  }
  render() {
    const { steps, currentStepIndex } = this.props;
    const { activeIndex } = this.state;

    const progresses = steps.map( (step, i) => {

      return this.renderStep(step, i)
    })

    return (
      <div className="sw-progress-bar">
        {this.renderSteps()}
        {this.renderInteration()}
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
  currentStepIndex: number
}
