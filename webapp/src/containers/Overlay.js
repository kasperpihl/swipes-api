import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import * as overlays from './overlays'

import PureRenderMixin from 'react-addons-pure-render-mixin';
class Overlay extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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