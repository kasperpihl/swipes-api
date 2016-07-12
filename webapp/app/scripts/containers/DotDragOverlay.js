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
    if(this.props.draggingDotPos){
      className += ' shown'
      const { clientX, clientY } = this.props.draggingDotPos;
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
    draggingDotPos: state.main.draggingDotPos
  }
}

const ConnectedDotDragOverlay = connect(mapStateToProps, {})(DotDragOverlay)
export default ConnectedDotDragOverlay