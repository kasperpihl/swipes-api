import React, { Component, PropTypes, Children } from 'react'
import './styles/slider.scss'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import { bindAll } from '../../classes/utils'

class Slider extends Component {
  constructor(props) {
    super(props)
    this.state = { activeIndex: -1 }
    this.calculateActiveIndex();
    this.transitionName = 'slideRight';
    bindAll(this, ['goLeft', 'goRight', 'clickedDot']);
  }
  calculateActiveIndex(){
    if(this.state.activeIndex === -1){
      this.state.activeIndex = Children.count(this.props.children) - 1;
    }
  }
  componentDidMount() {
  }
  goLeft(){
    const { activeIndex } = this.state;
    const { children } = this.props;
    let nextIndex = activeIndex - 1;
    if(nextIndex < 0){
      nextIndex = Children.count(children) - 1;
    }
    this.transitionName = 'slideRight';
    this.setState({activeIndex: nextIndex })
  }
  goRight(){
    const { activeIndex } = this.state;
    const { children } = this.props;
    let nextIndex = activeIndex + 1;
    if(nextIndex >= Children.count(children)){
      nextIndex = 0;
    }
    this.transitionName = 'slideLeft';
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
    if(!infinite && activeIndex === Children.count(children) - 1 ){
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
  clickedDot(e){
    const curr = this.state.activeIndex;
    const index = parseInt(e.target.getAttribute('data-index'), 10);
    this.transitionName = 'slideRight';
    if(index < curr){
      this.transitionName = 'slideLeft';
    }
    this.setState({activeIndex: index});
  }
  renderDotsTop(){
    const { dots } = this.props;
    if(dots && dots === 'top'){
      return this.renderDots('top');
    }
  }
  renderDotsBottom(){
    const { dots } = this.props;
    if(dots && dots !== 'top'){
      return this.renderDots('bottom');
    }
  }
  renderDots(pos){

    const { activeIndex:aI } = this.state;
    return (
      <div className="slider__dots">
        {this.props.children.map((c, i) => {
          let className = "slider__dot";
          if(i === aI){
            className += " slider__dot--active";
          }
          className += ' slider__dot--' + pos;

          return <div data-index={i} className={className} onClick={this.clickedDot} key={"dot-" + i} />
        })}
      </div>
    )
  }
  render() {
    return (
      <div className="slider">
        {this.renderLeftArrow()}
        <div className="slider__content">

          {this.renderDotsTop()}

          <ReactCSSTransitionGroup
            transitionName={this.transitionName}
            component="div"
            className="slider__children"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}>

              {this.renderChildren()}

          </ReactCSSTransitionGroup>

          {this.renderDotsBottom()}

        </div>
        {this.renderRightArrow()}
      </div>
    )
  }
}
export default Slider

const { number, bool, string, oneOfType } = PropTypes;
Slider.propTypes = {
  activeIndex: number,
  infinite: bool,
  dots: oneOfType([bool, string])
}
