import React, { Component, PropTypes } from 'react'
import Assigning from '../assigning/Assigning'

import './styles/step-header.scss'

class StepHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    const { index, title, assignees, me } = this.props;

    return (
      <div className="step-header">
        <div className="step-header__index">{index}.</div>
        <div className="step-header__title">{title}</div>
        <div className="step-header__assignees">
          <Assigning assignees={assignees} me={me}/>
        </div>
      </div>
    )
  }
}

export default StepHeader

const { number, string, array } = PropTypes;

StepHeader.propTypes = {
  index: number,
  title: string,
  assignees: array
}
