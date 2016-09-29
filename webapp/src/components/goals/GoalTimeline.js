import React, { Component, PropTypes } from 'react'
class GoalTimeline extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderSteps(){
    const renderedItems = [];
    steps.forEach((step) => {
      renderedItems.push(this.renderHeader(step));
      if(step === 'currentStep'){
        renderedItems.push(this.renderStep(step));
      }
    });
    return renderedItems;
  }
  renderHeader(step){
    return <GoalStepHeader />
  }
  renderStep(step){
    return <GoalStep />
  }
  
  render() {
    return (
      <div>

      </div>
    )
  }
}
export default GoalTimeline

const { string, arrayOf, object } = PropTypes;
GoalTimeline.propTypes = {
  steps: arrayOf(object),
  delegate: object
}