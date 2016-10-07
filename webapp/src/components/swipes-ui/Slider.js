import React, { Component, PropTypes } from 'react'
class Slider extends Component {
  constructor(props) {
    super(props)
    this.state = { activeIndex: -1 }
    this.calculateActiveIndex();
  }
  calculateActiveIndex(){
    if(this.state.activeIndex === -1){
      this.state.activeIndex = this.props.children.length - 1;
    }
  }
  componentDidMount() {
  }
  renderLeftArrow(){
    return (
      <div className="slider__nav slider__nav--left">
        <i className="material-icons">keyboard_arrow_left</i>
      </div>
    )
  }
  renderRightArrow(){
    return (
      <div className="slider__nav slider__nav--right">
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
          {this.renderChildren()}
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