import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import TemplateSelector from './TemplateSelector'
import '../components/overlay/overlay.scss'
class Overlay extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  renderOverlay(){
    const { overlay } = this.props;
    if(overlay === 'TemplateSelector'){
      return <TemplateSelector />
    }
    return null;
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
    overlay: state.getIn(['main', 'overlay'])
  }
}

const ConnectedOverlay = connect(mapStateToProps, {
})(Overlay)
export default ConnectedOverlay