import React, { Component, PropTypes } from 'react'
import './styles/slider.scss'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import { bindAll } from '../../classes/utils'

class Slider extends Component {
  constructor(props) {
    super(props)
    this.state = { activeIndex: -1 }
    this.calculateActiveIndex();
    bindAll(this, ['goLeft', 'goRight']);
  }
  calculateActiveIndex(){
    if(this.state.activeIndex === -1){
      this.state.activeIndex = this.props.children.length - 1;
    }
  }
  componentDidMount() {
  }
  componentWillUpdate(nextProps, nextState){
    this.transitionName = 'slideLeft';
    if(nextState.activeIndex < this.state.activeIndex){
      this.transitionName = 'slideRight';
    }
  }
  goLeft(){
    const { activeIndex } = this.state;
    let nextIndex = activeIndex - 1;
    if(nextIndex < 0){
      nextIndex = this.props.children.length - 1;
    }
    this.setState({activeIndex: nextIndex })
  }
  goRight(){
    const { activeIndex } = this.state;
    let nextIndex = activeIndex + 1;
    if(nextIndex >= this.props.children.length){
      nextIndex = 0;
    }
    this.setState({activeIndex: nextIndex });
  }
  renderLeftArrow(){
    return (
      <div className="slider__nav slider__nav--left" onClick={this.goLeft}>
        <i className="material-icons">keyboard_arrow_left</i>
      </div>
    )
  }
  renderRightArrow(){
    return (
      <div className="slider__nav slider__nav--right" onClick={this.goRight}>
        <i className="material-icons">keyboard_arrow_right</i>
      </div>
    )
  }
  renderChildren(){
    return this.props.children.filter((c, i) => i === this.state.activeIndex);
  }
  render() {
    console.log(this.state.activeIndex);
    return (
      <div className="slider">
        {this.renderLeftArrow()}
        <div className="slider__content">
          <ReactCSSTransitionGroup transitionName="slideSlider" component="div" className="toasty" transitionEnterTimeout={300} transitionLeaveTimeout={600}>
            {this.renderChildren()}
          </ReactCSSTransitionGroup>
        </div>
        {this.renderRightArrow()}
      </div>
    )
  }
}
export default Slider

const { number } = PropTypes;
Slider.propTypes = {
  activeIndex: number
}
