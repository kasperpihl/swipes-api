import React, { Component, PropTypes } from 'react'
import Assigning from '../assigning/Assigning'
import ProgressBar from '../swipes-ui/ProgressBar'

import './styles/step-header.scss'

class StepHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderProgressBar() {
    const progIndex = 2;
    const progData = [
      {
        title: 'One',
        completed: true
      },
      {
        title: 'Two',
        completed: true
      },
      {
        title: 'Three',
        completed: false
      },
      {
        title: 'Four',
        completed: false
      }
    ];

    return (
      <div className="step-header__progress-bar">
        <ProgressBar index={progIndex} steps={progData} />
      </div>
    )
  }
  render() {
    const { index, step, goal } = this.props;


    return (
      <div className="step-header">
        <div className="step-header__flex-container">
          <div className="step-header__index">1</div>
          <div className="step-header__title">Decision</div>
          <div className="step-header__assigning"></div>
        </div>
        {this.renderProgressBar()}
      </div>
    )
  }
}

export default StepHeader

const { number } = PropTypes;

StepHeader.propTypes = {
  index: number
}
