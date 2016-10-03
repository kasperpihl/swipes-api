import React, { Component, PropTypes } from 'react'
import GoalStepHeader from './GoalStepHeader'
import GoalStep from './GoalStep'
import { debounce, bindAll } from '../../classes/utils'
import { VelocityTransitionGroup } from 'velocity-react'

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
  componentWillUpdate(nextProps, nextState){
    this.shouldAutoScroll = (nextState.activeIndex > this.state.activeIndex);
  }
  componentDidUpdate(){
    if(this.shouldAutoScroll && this.state.activeIndex > -1){
      const scrollVal = (69 * this.state.activeIndex);
      // document.querySelector('.steps-timeline').scrollTop = scrollVal;
      this.scrollTo(document.querySelector('.steps-timeline'), scrollVal, 400)
    }
  }
  scrollTo(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop == to) return;
      scrollTo(element, to, duration - 10);
    }, 10);
  }
  clickedHeader(index){
    index = index - 1;
    if(index === this.state.activeIndex){
      this.setState({activeIndex: false});
    } else {
      this.setState({activeIndex: index});
    }
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
    const { data } = this.props;
    const isLast = index === data.length;
    return <GoalStepHeader onClick={this.clickedHeader} isLast={isLast} index={index} active={active} data={{step, index}} key={'header' + index} />
  }
  renderStep(step, i){
    return <GoalStep data={step} key={'step' + i} />
  }

  render() {
    return (
      <VelocityTransitionGroup ref="scroller" component="div" className="steps-timeline" enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
        {this.renderSteps()}
      </VelocityTransitionGroup>
    )
  }
}
export default GoalTimeline

const { string, arrayOf, object } = PropTypes;
GoalTimeline.propTypes = {
  data: arrayOf(object),
  delegate: object
}
