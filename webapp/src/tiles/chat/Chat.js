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
  createItemDelegate(){
    const { swipes } = this.props;
    return {
      editMessage: this.slackData.editMessage,
      deleteMessage: this.slackData.deleteMessage,
      openImage: this.slackData.openImage,
      loadPrivateImage: this.slackData.loadPrivateImage,
      isShareURL: swipes.isShareURL,
      getUserFromId: this.slackData.getUserFromId,
      clickLink: (url) => swipes.sendEvent('openURL', {url: url}),
    }
  }
  render() {
    const sortedMessages = this.slackData.sortMessagesForSwipes();
    return (
      <div style={{height :'100%'}}>
        <ChatList sections={sortedMessages} itemDelegate={this.createItemDelegate()} />
        <ChatInput sendMessage={this.sendMessage} />
      </div>
    )
  }
}

export default Chat;