import React, { Component, PropTypes } from 'react'
import GoalStepHeader from './GoalStepHeader'
import GoalStep from './GoalStep'
import { debounce, bindAll, autoscroll } from '../../classes/utils'
import { VelocityTransitionGroup } from 'velocity-react'
import {successState} from '../../icons'

import './styles/goal-timeline.scss'

class GoalTimeline extends Component {
  constructor(props) {
    super(props)
    this.state = { activeIndex: -1, currentIndex: -1 }
    this.updateCurrentAndActive();
    bindAll( this, [ 'clickedHeader', 'callDelegate']);

  }
  callDelegate(name){
    const { delegate } = this.props;
    if(delegate && typeof delegate[name] === "function"){
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }
  updateCurrentAndActive(){
    const { goal } = this.props;
    if(goal){
      const {
        activeIndex,
        currentIndex
      } = this.state;

      const newState = { activeIndex, currentIndex };
      const steps = goal.get('steps');
      steps.forEach((step, i) => {
        if(newState.currentIndex === -1 && (!step.get('completed') || i === steps.size - 1)){
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
        const el = document.querySelector('.steps-timeline');
        autoscroll(el, scrollVal, 200);
      }, 450);
      //

    }
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
    const { goal } = this.props;
    const steps = goal.get('steps');
    const renderedItems = [];
    if(!steps){
      return null;
    }

    const {
      currentIndex,
      activeIndex
    } = this.state;

    const allClosed = (activeIndex === false);
    steps.forEach((step, i) => {
      renderedItems.push(this.renderHeader(step, i, ((!step.get('completed') && allClosed) || activeIndex === i)));

      if(!allClosed && i === activeIndex){
        renderedItems.push(this.renderStep(step, i));
      }
    });

    return renderedItems;
  }
  renderHeader(step, i, active){
    const { goal } = this.props;
    const steps = goal.get('steps');
    const isLast = i === steps.size - 1;
    return <GoalStepHeader onClick={this.clickedHeader} isLast={isLast} active={active} step={step} index={i+1} key={'header' + i} />
  }
  renderStep(step, i){
    return <GoalStep data={step} key={'step' + i} callDelegate={this.callDelegate} />
  }
  renderCompleted() {
    const { goal } = this.props;
    const lastCompleted = goal.get('steps').last().get('completed');
    if (lastCompleted) {
      return <img src={successState} key="completedState" />;
    }

  }
  render() {
    const { goal } = this.props;

    return (
      <VelocityTransitionGroup ref="scroller" component="div" className="steps-timeline" enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
        {this.renderSteps()}
        {this.renderCompleted()}
      </VelocityTransitionGroup>
    )
  }
}
export default GoalTimeline

const { string, arrayOf, object } = PropTypes;
GoalTimeline.propTypes = {
  delegate: object
}
