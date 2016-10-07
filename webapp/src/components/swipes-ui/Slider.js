import React, { Component, PropTypes } from 'react'
import './styles/slider.scss'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import { bindAll } from '../../classes/utils'

class Slider extends Component {
  constructor(props) {
    super(props)
    this.state = { activeIndex: -1 }
    this.calculateActiveIndex();
    this.transitionName = 'slideLeft';
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
  renderIndicators(){

  }
  renderLeftArrow(){
    const { infinite } = this.props;
    const { activeIndex } = this.state;

    let className = "slider__nav";
    if(!infinite && activeIndex === 0 ){
      className += ' slider__nav--disabled';
    }
    
    return (
      <div className={className} onClick={this.goLeft}>
        <i className="material-icons">keyboard_arrow_left</i>
      </div>
    )
    
  }
  renderRightArrow(){
    const { infinite, children } = this.props;
    const { activeIndex } = this.state;

    let className = "slider__nav";
    if(!infinite && activeIndex === children.length - 1 ){
      className += ' slider__nav--disabled';
    }
    return (
      <div className={className} onClick={this.goRight}>
        <i className="material-icons">keyboard_arrow_right</i>
      </div>
    )
  }
  renderChildren(){
    const { activeIndex:aI } = this.state;

    return this.props.children.map((c, i) => {
      return <div key={"child-" + i} className="slider__child">{c}</div>;
    }).filter((c, i) => i === aI);
  }
  render() {
    console.log(this.state.activeIndex);
    return (
      <div className="slider">
        {this.renderLeftArrow()}
        <ReactCSSTransitionGroup
          transitionName={this.transitionName}
          component="div"
          className="slider__content"
          transitionEnterTimeout={500} 
          transitionLeaveTimeout={500}>

            {this.renderChildren()}

        </ReactCSSTransitionGroup>
        {this.renderRightArrow()}
      </div>
    )
  }
}
export default Slider

const { number, bool } = PropTypes;
Slider.propTypes = {
  activeIndex: number,
  infinite: bool
}
