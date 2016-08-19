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
    this.state = { started: false, isStarting: false, inputHeight: 60 }

    bindAll(this, ['sendMessage', 'onSelectedRow', 'changedHeight'])
    this.slackData = new SlackData(props.swipes, props.tile.data);
  }
  componentDidMount(){
  }
  componentDidUpdate(prevProps, prevState){
    //console.log('updated', this.props.tile.data);
  }
  changedHeight(height){
    if(this.state.inputHeight !== height){
      this.setState({inputHeight: height});
    }
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

    let sortedMessages;
    if(this.props.tile.data){
      sortedMessages = this.props.tile.data.sortedMessages; 
    }
    const sectionsSidemenu = this.slackData.sectionsForSidemenu();
    const paddingBottom = this.state.inputHeight + 'px';
    return (
      <div style={{height :'100%', paddingBottom}}>
        <Sidemenu onWidthChanged={this.onSidemenuWidthChanged} onSelectedRow={this.onSelectedRow} data={{sections: sectionsSidemenu }} />
        <ChatList sections={sortedMessages} markAsRead={this.slackData.markAsRead} itemDelegate={this.createItemDelegate()} />
        <ChatInput sendMessage={this.sendMessage} changedHeight={this.changedHeight} />
      </div>
    )
  }
}

export default Chat;