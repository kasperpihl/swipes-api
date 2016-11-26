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
  render() {
    const { submission, disabled } = this.props;
    let className = 'step-submission';
    let btns = ['Submit'];

    if(submission && submission.get('type') === 'decide'){
      btns = ['Yes', 'No'];
    }

    console.log('disabled', disabled)

    if (disabled) {
      className += ' step-submission--disabled'
    }

    return (
      <div className={className}>
        <div className="step-submission__actions">
          {btns.map((t,i) => <div className="step-submission__button" onClick={this.onSubmit} data-index={i} key={i}>{t}</div>)}
        </div>
      </div>
    )
  }
}

export default StepSubmission

const { string, shape, func, arrayOf } = PropTypes;

StepSubmission.propTypes = {
}
