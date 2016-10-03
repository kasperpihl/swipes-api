import React, { Component, PropTypes } from 'react'
import GoalStepHeader from './GoalStepHeader'
import GoalStep from './GoalStep'
import { debounce, bindAll } from '../../classes/utils'
import { VelocityTransitionGroup } from 'velocity-react'

import './styles/goal-timeline.scss'

class GoalTimeline extends Component {
  constructor(props) {
    super(props)
    this.state = { activeIndex: -1, currentIndex: -1 }
    this.updateCurrentAndActive();
    bindAll( this, ['onScroll', 'clickedHeader']);
  }
  callDelegate(name){
    const { delegate } = this.props;
    if(delegate && typeof delegate[name] === "function"){
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }
  updateCurrentAndActive(){
    const { data } = this.props;
    if(data){
      const {
        activeIndex,
        currentIndex
      } = this.state;

      const newState = { activeIndex, currentIndex };
      data.forEach((step, i) => {
        if(newState.currentIndex === -1 && (!step.completed || i === data.length - 1)){
          newState.currentIndex = i;
          newState.activeIndex = i;
        }
      })

      if(activeIndex === -1){
        this.state = newState;
      }
      else if(newState.currentIndex !== currentIndex || newState.activeIndex !== activeIndex){
        this.setState(newState);
      }
    }
  }
  componentDidMount() {
  }
  componentWillUpdate(nextProps, nextState){
    this.shouldAutoScroll = this.state.activeIndex && (nextState.activeIndex > this.state.activeIndex);
  }
  componentWillUnmount(){
    if(this.autoscrollTimer){
      clearTimeout(this.autoscrollTimer);
    }
  }
  componentDidUpdate(){
    if(this.autoscrollTimer){
      clearTimeout(this.autoscrollTimer);
    }
    if(this.shouldAutoScroll){
      this.autoscrollTimer = setTimeout(() => {
        const scrollVal = (69 * this.state.activeIndex);
        document.querySelector('.steps-timeline').scrollTop = scrollVal;
        console.log('scroll W', scrollVal)
      }, 500);
      //
      
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

    const { 
      currentIndex,
      activeIndex
    } = this.state;

    const allClosed = (activeIndex === false);
    data.forEach((step, i) => {
      renderedItems.push(this.renderHeader(step, i, ((!step.completed && allClosed) || activeIndex === i)));

      if(!allClosed && i === activeIndex){
        renderedItems.push(this.renderStep(step, i));
      }
    });

    return renderedItems;
  }
  renderHeader(step, i, active){
    const { data } = this.props;
    const isLast = i === data.length - 1;
    return <GoalStepHeader onClick={this.clickedHeader} isLast={isLast} active={active} data={{step, index: i+1}} key={'header' + i} />
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
