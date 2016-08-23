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

    bindAll(this, ['sendMessage', 'onSelectedRow', 'changedHeight', 'addListenersToSwipes', 'dataDelegate', 'unreadAbove', 'clickedLink'])
    this.addListenersToSwipes(props.swipes);
    const data = {};
    const selectedChannel = localStorage.getItem(props.tile.id + '-selectedChannelId');
    if(selectedChannel){
      data.selectedChannelId = selectedChannel;
    }
    this.slackData = new SlackData(this.props.swipes, data, this.dataDelegate);
  }
  dataDelegate(data){
    if(data.selectedChannelId && data.selectedChannelId !== this.state.selectedChannelId){
      const itemId = this.props.tile.id + '-selectedChannelId';
      if(!data.selectedChannelId){
        localStorage.removeItem(itemId);
      }
      else {
        localStorage.setItem(itemId, data.selectedChannelId);
      }
    }
    this.setState(data);
  }
  addListenersToSwipes(swipes){
    swipes.addListener('share.receivedData', (data) => {
      var input = data.text || data.url || ''; 
      if (input.length) {
        this.slackData.sendMessage(input);
      }
    });
  }
  unreadAbove(unread){
    if(this.state.unreadAbove !== unread){
      this.setState({unreadAbove: unread});
    }
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
    this.slackData.setChannel(row.id);
    document.getElementById('chat-input').focus();
  }
  createItemDelegate(){
    const { swipes } = this.props;
    return {
      editMessage: this.slackData.editMessage,
      deleteMessage: this.slackData.deleteMessage,
      openImage: this.slackData.openImage,
      loadPrivateImage: this.slackData.loadPrivateImage
    }
  }
  renderSidemenu(){
    const sectionsSidemenu = this.state.sectionsSidemenu || [];
    if(!sectionsSidemenu.length){
      return;
    }
    return (
      <Sidemenu 
        onWidthChanged={this.onSidemenuWidthChanged} 
        onSelectedRow={this.onSelectedRow} 
        data={{sections: sectionsSidemenu }} 
      />
    )
  }
  renderUnreadAbove(){
    var unreadClass = "unread-bar";
    if(!this.state.unreadAbove){
      unreadClass += " read";
    } 
    return (
      <a key="unread-test" href="#unread-indicator">
        <div className={unreadClass}>Unread messages above <i className="material-icons">arrow_upward</i> </div></a>)
  }
  renderTypingIndicator(label){
    
    if(label){
      return (
        <div className="typing-indicator">{label}</div>
      )
    }
  }
  clickedLink(command, identifier, title){
    const { swipes } = this.props;
    swipes.sendEvent('openURL', {url: command})
  }
  render() {
    const { typingLabel, sortedMessages, inputHeight } = this.state; 
    
    let paddingBottom = inputHeight;
    if(typingLabel){
      paddingBottom += 14;
    }

    return (
      <div style={{height :'100%', paddingBottom: paddingBottom + 'px'}}>
        {this.renderSidemenu()}
        {this.renderUnreadAbove()}
        <ChatList 
          sections={sortedMessages} 
          markAsRead={this.slackData.markAsRead} 
          unreadAbove={this.unreadAbove}
          unreadIndicator={this.state.unreadIndicator} 
          clickedLink={this.clickedLink}
        />
        <ChatInput
          sendMessage={this.sendMessage} 
          changedHeight={this.changedHeight} 
          uploadFiles={this.slackData.uploadFiles}
          sendTypingEvent={this.slackData.sendTypingEvent}
        />
        {this.renderTypingIndicator(typingLabel)}
      </div>
    )
  }
}

export default Chat;