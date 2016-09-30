import React, { Component, PropTypes } from 'react'
import GoalStepHeader from './GoalStepHeader'
import GoalStep from './GoalStep'
import './styles/goal-timeline.scss'

class GoalTimeline extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderSteps(){
    const { data } = this.props;
    const renderedItems = [];

    data.forEach((step, i) => {
      renderedItems.push(this.renderHeader(step, i+1));

      if(step.active){
        renderedItems.push(this.renderStep(step, i));
      }
    });

    return renderedItems;
  }
  renderHeader(step, index){
    return <GoalStepHeader data={{step, index}} key={index} />
  }
  renderStep(step, i){
    var ran = Math.random();
    return <GoalStep data={step} key={ran} />
  }

  render() {
    return (
      <div className="steps-timeline">
        {this.renderSteps()}
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
