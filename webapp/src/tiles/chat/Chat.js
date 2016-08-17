import React, { Component, PropTypes } from 'react'
import './styles/main.scss'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../constants/ActionTypes'
import { bindAll } from '../../classes/utils'

import SlackData from './slack-data'

import ChatList from './ChatList'
import ChatInput from './ChatInput'

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = { started: false, isStarting: false }

    bindAll(this, ['sendMessage'])

    this.slackData = new SlackData(props.swipes, props.tile.data);
  }
  componentDidMount(){
  }
  componentDidUpdate(prevProps, prevState){
    console.log('updated', this.props.tile.data);
  }

  sendMessage(message){
    this.slackData.sendMessage(message);
    console.log('send!');
  }
  render() {
    const sortedMessages = this.slackData.sortMessagesForSwipes();
    return (
      <div style={{height :'100%'}}>
        <ChatList sections={sortedMessages} />
        <ChatInput sendMessage={this.sendMessage} />
      </div>
    )
  }
}

export default Chat;