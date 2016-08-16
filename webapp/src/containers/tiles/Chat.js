import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../constants/ActionTypes'
import { bindAll } from '../../classes/utils'

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    bindAll(this, [ 'onClick' ])
  }
  componentDidMount(){
    const { swipes, saveData, tileId } = this.props
    swipes.service('slack').request('rtm.start').then((res, err) => {

      swipes.saveData({test: true}, true);
    })
    // services.request
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

export default Chat;