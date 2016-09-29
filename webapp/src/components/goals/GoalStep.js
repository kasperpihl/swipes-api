import React, { Component, PropTypes } from 'react'
class GoalStep extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderDescription(){

  }
  renderAction(){
    // red square
  }
  renderStatus(){

  }
  renderComplete(){

  }
  render() {
    return (
      <div>
        {this.renderDescription()}
        {this.renderAction()}
        {this.renderStatus()}
        {this.renderComplete()}
      </div>
    )
  }
}
export default GoalStep

const { string, string } = PropTypes;
GoalStep.propTypes = {
  description: string,
  statusLabel: string,
  completeButton: bool
}