import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import TemplateSelector from './TemplateSelector'
import Services from './Services'
import '../components/overlay/overlay.scss'
class Overlay extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  renderOverlay(){
    const overlay = this.props.overlays.last();
    console.log('overlay', overlay);
    if(!overlay){
      return;
    }
    let Comp;

    const { component, props } = overlay.toJS();

    if(component === 'TemplateSelector'){
      Comp = TemplateSelector;
    }
    if(component === 'Services'){
      Comp = Services;
    }
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