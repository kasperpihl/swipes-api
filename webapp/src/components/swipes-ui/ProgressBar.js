import React, { Component, PropTypes } from 'react'
import { bindAll } from '../../classes/utils'

import './styles/progress-bar.scss'

class ProgressBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIndex: props.index || 0
    }

    bindAll(this, ['onChange']);
  }
  callDelegate(name) {
    const { delegate } = this.props;

    if (delegate && typeof delegate[name] === "function") {
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }
  componentDidMount() {
  }
  onChange(i) {
    const { activeIndex } = this.state;

    if (activeIndex !== i) {
      this.setState({activeIndex: i});
      this.callDelegate('barDidChange', i);
    }
  }
  renderStep(step, i) {
    const { activeIndex } = this.state;
    let className = 'sw-progress-bar__step';

    if (step.completed) {
      className += ' sw-progress-bar__step--completed'
    }

    if (i === activeIndex) {
      className += ' sw-progress-bar__step--active'
    }

    return (
      <div className={className} data-attr={`${i + 1} ${step.title}`} key={`progress-step-${i}`} onClick={this.onChange}></div>
    )
  }
  render() {
    const { steps } = this.props;
    const { activeIndex } = this.state;

    const progresses = steps.map( (step, i) => {
      return this.renderStep(step, i)
    })

    return (
      <div className="sw-progress-bar">
        {progresses}
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
  index: number
}
