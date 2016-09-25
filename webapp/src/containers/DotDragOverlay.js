import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../constants/ActionTypes'

class DotDragOverlay extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onMouseMove = this.onMouseMove.bind(this)
  }
  componentDidMount(){
    window.addEventListener("mousemove", this.onMouseMove);
  }
  componentWillUnmount(){
    window.removeEventListener('mousemove', this.onMouseMove);
  }
  onMouseMove(e){
    if(this.props.draggingDot){
      const { clientX, clientY } = e;
      this.setState({ clientX, clientY })
    }
  }
  render() {
    let className = 'dot-drag-handler';
    
    const styles = {};
    const {draggingDot} = this.props;
    //console.log('dotting', draggingDot);
    if(draggingDot){
      className += ' shown'
      const { clientX, clientY } = this.state;
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