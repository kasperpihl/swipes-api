import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../constants/ActionTypes'
import { bindAll } from '../classes/utils'

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    bindAll(this, [ 'onClick' ])
  }
  componentDidMount(){
    console.log(this.props);
  }
  initialLoad(){
    const { swipes } = this.props;

  }
  onClick(){
    const { swipes } = this.props;
  }
  render() {
    return (
      <div style={{height :'100%'}} onClick={this.onClick}>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    
  }
}

Chat.propTypes = {
  
}

const ConnectedChat = connect(mapStateToProps, {
})(Chat)
export default ConnectedChat