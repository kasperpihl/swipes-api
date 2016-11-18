import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'

class StepField extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderIcon(icon) {
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="goal-step__icon goal-step__icon--svg"/>;
    }
    else{
      return <img className="goal-step__icon goal-step__icon--img" src={icon} />
    }
  }
  render() {
    const { icon, title, children } = this.props;

    return (
      <div className="goal-step__field">
        <div className="goal-step__field-header">
          <div className="goal-step__field-icon">
            {this.renderIcon(icon)}
          </div>
          <div className="goal-step__field-title">
            {title}
          </div>
          <div className="goal-step__field-action" title="Fullscreen">
            {this.renderIcon('ArrowLeftIcon')}
            {this.renderIcon('ArrowRightIcon')}
          </div>
        </div>
        {children}
      </div>
    )
  }
}

export default StepField

const { string } = PropTypes;

StepField.propTypes = {
  icon: string,
  title: string
}
