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
  onSubmit(e){
    const goBack = (parseInt(e.target.getAttribute('data-index'), 10));
    const { onSubmit } = this.props;
    if(onSubmit){
      onSubmit(goBack);
    }
  }
  renderActions() {
    let btns = ['Submit'];
    const { submission } = this.props;

    if(submission && submission.get('type') === 'decide'){
      btns = ['Yes', 'No'];
    }

    return (
      <div className="step-submission__actions">
        {btns.map((t,i) => <div className="step-submission__button" onClick={this.onSubmit} data-index={i} key={i}>{t}</div>)}
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
