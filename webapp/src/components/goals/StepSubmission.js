import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import './styles/step-submission.scss'

class StepSubmission extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
  }
  onSubmit(){
    const { onSubmit } = this.props;
    if(onSubmit){
      onSubmit();
    }
  }
  renderActions() {
    return (
      <div className="step-submission__actions">
        <div className="step-submission__button" onClick={this.onSubmit} key={'step-action-button'}>Submit</div>
      </div>
    )
  }
  render() {
    return (
      <div className="step-submission">
        {this.renderActions()}
      </div>
    )
  }
}

export default StepSubmission

const { string, shape, func, arrayOf } = PropTypes;

StepSubmission.propTypes = {
}
