import React, { Component, PropTypes } from 'react'
import './styles/main.scss'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../constants/ActionTypes'
import { bindAll } from '../../classes/utils'
import Sidemenu from '../../components/sidemenu/Sidemenu'

import SlackData from './slack-data'

import ChatList from './ChatList'
import ChatInput from './ChatInput'

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = { started: false, isStarting: false }

    bindAll(this, ['sendMessage', 'onSelectedRow'])
    
    this.slackData = new SlackData(props.swipes, props.tile.data);
  }
  componentDidMount(){
  }
  componentDidUpdate(prevProps, prevState){
    //console.log('updated', this.props.tile.data);
  }

  sendMessage(message){
    this.slackData.sendMessage(message);  
  }
  onSelectedRow(row){
    console.log(row);
    this.slackData.setChannel(row.id);
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
    const sectionsSidemenu = this.slackData.sectionsForSidemenu();
    return (
      <div style={{height :'100%'}}>
        <Sidemenu onWidthChanged={this.onSidemenuWidthChanged} onSelectedRow={this.onSelectedRow} data={{sections: sectionsSidemenu }} />
        <ChatList sections={sortedMessages} itemDelegate={this.createItemDelegate()}/>
        <ChatInput sendMessage={this.sendMessage} />
      </div>
    )
  }
}

export default Chat;