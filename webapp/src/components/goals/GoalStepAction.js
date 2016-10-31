import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import './styles/goal-step-action.scss'

class GoalStepAction extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderIcon(icon){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="goal-step-action__icon"/>;
    }
  }
  renderHeader() {
    const { icon, title } = this.props.data;

    return (
      <div className="goal-step-action__header">
        {this.renderIcon(icon)}
        <div className="goal-step-action__title">{title}</div>
      </div>
    )
  }
  renderActions() {
    const { buttons } = this.props.data;

    const actions = buttons.map( (button) => {

      return (
        <div className="goal-step-action__button" onClick={button.callback}>{button.label}</div>
      )
    })

    return (
      <div className="goal-step-action__actions">
        {actions}
      </div>
    )
  }
  render() {
    return (
      <div className="goal-step-action">
        {this.renderHeader()}
        {this.renderActions()}
      </div>
    )
  }
}

export default GoalStepAction

const { string, shape, func, arrayOf } = PropTypes;

GoalStepAction.propTypes = {
 data: shape({
   title: string,
   icon: string,
   buttons: arrayOf(shape({
     icon: string,
     callback: func
   }))
 })
}
