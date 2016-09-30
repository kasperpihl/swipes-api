import React, { Component, PropTypes } from 'react'
import GoalStepHeader from './GoalStepHeader'
import GoalStep from './GoalStep'
import { debounce, bindAll } from '../../classes/utils'
import './styles/goal-timeline.scss'

class GoalTimeline extends Component {
  constructor(props) {
    super(props)
    this.state = { activeIndex: -1 }
    bindAll( this, ['onScroll', 'clickedHeader']);
  }
  callDelegate(name){
    const { delegate } = this.props; 
    if(delegate && typeof delegate[name] === "function"){
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }
  componentDidMount() {
  }
  clickedHeader(index){
    index = index - 1;
    if(index === this.state.activeIndex){
      this.setState({activeIndex: false});
    } else {
      this.setState({activeIndex: index});
    }
  }
  onScroll(){
    console.log(this.refs.scroller.scrollTop);
  }
  renderSteps(){
    const { data } = this.props;
    const renderedItems = [];
    if(!data){
      return null;
    }
    let currentStep;
    let activeIndex = this.state.activeIndex;
    const allClosed = (activeIndex === false);
    console.log('active', activeIndex);
    data.forEach((step, i) => {
      // Set the current step to the first step that is not completed
      if(!step.completed && typeof currentStep === 'undefined'){
        currentStep = i;
        if(activeIndex === -1){
          activeIndex = i;
        }
      }
      renderedItems.push(this.renderHeader(step, i+1, (allClosed || activeIndex === i)));

      if(!allClosed && i === activeIndex){
        renderedItems.push(this.renderStep(step, i));
      }
    });

    return renderedItems;
  }
  renderHeader(step, index, active){
    return <GoalStepHeader onClick={this.clickedHeader} index={index} active={active} data={{step, index}} key={'header' + index} />
  }
  renderStep(step, i){
    return <GoalStep data={step} key={'step' + i} />
  }

  render() {
    return (
      <div className="steps-timeline" ref="scroller" onScroll={this.onScroll}>
        {this.renderSteps()}
      </div>
    )
  }
}
export default GoalTimeline

const { string, arrayOf, object } = PropTypes;
GoalTimeline.propTypes = {
  data: arrayOf(object),
  delegate: object
}
