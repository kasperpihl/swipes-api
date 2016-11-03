import React, { Component, PropTypes } from 'react'


// Views
import StepHeader from './StepHeader'
import StepAction from './StepAction'
// Primary actions like Form and Decision...
import * as actions from './actions'
// Secondaries
import Readme from './secondary/Readme'
import Checklist from './secondary/Checklist'


class Step extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {

  }
  renderHeader(){

  }
  renderSecondaries(){

  }
  renderPrimary(){

  }
  renderAction(){

  }
  render() {
    return (
      <div className="goal-step">
        <div className="goal-step-scroller">
          {this.renderHeader()}
          {this.renderSecondaries()}
          {this.renderPrimary()}
        </div>
        <div className="goal-step-action">
          {this.renderAction()}
        </div>
      </div>
    )
  }
}

export default Step

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'

Step.propTypes = {
  goal: map,
  step: map
}
