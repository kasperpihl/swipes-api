import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import * as overlays from './overlays'

import PureRenderMixin from 'react-addons-pure-render-mixin';
class Overlay extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.transitionName = "slideRight";
  }
  renderOverlay(){
    const overlay = this.props.overlays.last();
    if(!overlay){
      return;
    }
    let props = {};
    if(overlay.get('props')){
      props = overlay.get('props').toObject();
    }
    let Comp = overlays[overlay.get('component')];
    if(Comp){
      return <Comp {...props} />
    }
  }
  componentWillUpdate(nextProps){
    const { oldVal } = this.props;
    const { newVal } = nextProps;
    if(newVal.size !== oldVal.size){
      // Is the first overlay to be shown
      if(!oldVal.size && newVal.size){
        this.transitionName = 'fadeIn';
      }
      // Removing the last overlay
      else if(oldVal.size && !newVal.size){
        this.transitionName = 'fadeOut'
      }
      // Pushing a new overlay
      else if(newVal.size > oldVal.size){
        this.transitionName = 'slideLeft';
      }
      // Popping an overlay (going back with breadcrumps)
      else if(newVal.size < oldVal.size){
        this.transitionName = 'slideRight';
      }
    }
    else if(newVal.size && newVal.size === oldVal.size){
      // Replacing overlay with a new overlay
      if(oldVal.last().get('component') !== newVal.last().get('component')){
        this.transitionName = 'fade';
      }
    }
  }
  render() {
    const renderedOverlay = this.renderOverlay();
    let className = "overlay";
    if(renderedOverlay){
      className += ' overlay--shown'
    }
    return (
      <div className={className}>
        {renderedOverlay}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    overlays: state.get('overlays')
  }
}

const ConnectedOverlay = connect(mapStateToProps, {
})(Overlay)
export default ConnectedOverlay