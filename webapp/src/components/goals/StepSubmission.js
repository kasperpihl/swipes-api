import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import './styles/step-submission.scss'

class StepSubmission extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderIcon(icon){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="step-submission__icon"/>;
    }
  }
  renderHeader() {
    const { icon, title } = this.props.data;

    return (
      <div className="step-submission__header">
        {this.renderIcon(icon)}
        <div className="step-submission__title">{title}</div>
      </div>
    )
  }
  renderActions() {
    const { buttons } = this.props.data;

    const actions = buttons.map( (button, i) => {

      return (
        <div className="step-submission__button" onClick={button.callback} key={'step-action-button' + i}>{button.label}</div>
      )
    })

    return (
      <div className="step-submission__actions">
        {actions}
      </div>
    )
  }
  render() {
    return (
      <div className="step-submission">
        {this.renderHeader()}
        {this.renderActions()}
      </div>
    )
  }
}

export default StepSubmission

const { string, shape, func, arrayOf } = PropTypes;

StepSubmission.propTypes = {
 data: shape({
   title: string,
   icon: string,
   buttons: arrayOf(shape({
     icon: string,
     callback: func
   }))
 })
}
