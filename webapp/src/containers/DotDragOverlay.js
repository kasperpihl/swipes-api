import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../constants/ActionTypes'

class DotDragOverlay extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    let className = 'dot-drag-handler';
    
    const styles = {};
    const {draggingDot} = this.props;
    if(draggingDot && draggingDot.pos){
      className += ' shown'
      const { clientX, clientY } = draggingDot.pos;
      const ts = 'translate(' + (clientX-25) + 'px, ' + (clientY-25) + 'px)'
      styles.transform = ts; 
    }
    return (
      <div style={styles} className={className}>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    draggingDot: state.main.draggingDot
  }
}

const ConnectedDotDragOverlay = connect(mapStateToProps, {})(DotDragOverlay)
export default ConnectedDotDragOverlay