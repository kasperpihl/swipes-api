import React, { Component, PropTypes } from 'react'
import './styles/main.scss'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../constants/ActionTypes'
import { bindAll } from '../../classes/utils'
import SlackSocket from './slack-socket'
import ChatInput from './ChatInput'

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = { started: false, isStarting: false }

    bindAll(this, ['initialLoad', 'sendMessage'])

    this.socket = new SlackSocket(this.initialLoad);
  }
  componentDidMount(){
    this.initialLoad()
  }
  fetchChannel(){

  }
  initialLoad(){
    const { swipes, saveData, tileId } = this.props
    swipes.service('slack').request('rtm.start').then((res, err) => {
      if(res.ok){
        const saveObj = {};
        const keysToSave = [ 'team', 'users', 'self', 'bots', 'channels', 'groups', 'ims' ]
        Object.keys(res.data).forEach((key) => {
          if(keysToSave.indexOf(key) !== -1){
            saveObj[key] = res.data[key];
          }
        });
        swipes.saveData(saveObj, true);
      }
    })
  }
  sendMessage(message){
    console.log('send!');
  }
  render() {
    return (
      <div style={{height :'100%'}}>
        <ChatInput sendMessage={this.sendMessage} />
      </div>
    )
  }
}

export default Chat;