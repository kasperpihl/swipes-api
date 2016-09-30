import React, { Component, PropTypes } from 'react'
import GoalStepHeader from './GoalStepHeader'
import GoalStep from './GoalStep'
import { debounce, bindAll } from '../../classes/utils'
import './styles/goal-timeline.scss'

class GoalTimeline extends Component {
  constructor(props) {
    super(props)
    this.state = { }
    bindAll( this, ['onScroll']);
  }
  callDelegate(name){
    const { delegate } = this.props; 
    if(delegate && typeof delegate[name] === "function"){
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }
  componentDidMount() {
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
    data.forEach((step, i) => {
      renderedItems.push(this.renderHeader(step, i+1));

      if(step.active){
        renderedItems.push(this.renderStep(step, i));
      }
    });

    return renderedItems;
  }
  renderHeader(step, index){
    return <GoalStepHeader data={{step, index}} key={'header' + index} />
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
