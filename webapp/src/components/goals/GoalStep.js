import React, { Component, PropTypes } from 'react'
import './styles/goal-step.scss'
import PureRenderMixin from 'react-addons-pure-render-mixin';

class GoalStep extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  renderDescription(description){
    return (
      <div className="goal-step__description">{description}</div>
    )
  }
  renderAction(){
    const { callDelegate, data } = this.props;
    return callDelegate('renderActionForStep', data.get('id'));
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
    const { data } = this.props;
    const { description, statusLabel, completeButton, completed } = data.toJS();

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

const { string, bool, shape } = PropTypes;
GoalStep.propTypes = {
}
