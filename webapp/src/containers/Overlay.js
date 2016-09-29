import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import * as overlays from './overlays'

import '../components/overlay/overlay.scss'
import PureRenderMixin from 'react-addons-pure-render-mixin';
class Overlay extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {}
  }
  renderOverlay(){
    const overlay = this.props.overlays.last();
    if(!overlay){
      return;
    }

    const { component, props } = overlay.toJS();

    let Comp = overlays[component];
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