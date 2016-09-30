import React, { Component, PropTypes } from 'react'
import './styles/goal-step.scss'

class GoalStep extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderDescription(description){


    return (
      <div className="goal-step__description">{description}</div>
    )
  }
  renderAction(){

    return (
      <div className="kremlin"></div>
    )
  }
  renderStatus(label, completed){
    if (!label && !completed) {
      return;
    }

    let className = "goal-step__label";
    let content = label;

    if (completed) {
      className += ' goal-step__label--completed';
      content = 'This goal was completed by Stefan on 19th of Sept 2015'
    } else if (!completed && label) {
      className += ' goal-step__label--label'
    }

    return (
      <div className={className}>
      <i className="material-icons">check_circle</i>
      {content}
      </div>
    )

  }
  renderComplete(button, completed){
    if (!button || completed) {
      return;
    }

    return (
      <div className="goal-step__button">
        complete step
      </div>
    )
  }
  render() {
    const { description, statusLabel, completeButton, completed } = this.props.data
    console.log(completed);

    return (
      <div className="goal-step">
        {this.renderDescription(description)}
        {this.renderAction()}
        {this.renderStatus(statusLabel, completed)}
        {this.renderComplete(completeButton, completed)}
      </div>
    )
  }
}
export default GoalStep

const { string, bool } = PropTypes;
GoalStep.propTypes = {
  description: string,
  statusLabel: string,
  completeButton: bool
}
