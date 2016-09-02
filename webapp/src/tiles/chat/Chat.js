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

    bindAll(this, ['sendMessage', 'onSelectedRow', 'changedHeight', 'addListenersToSwipes', 'dataDelegate', 'unreadAbove', 'clickedLink', 'onCardShare', 'onCardAction'])
    this.addListenersToSwipes(props.swipes);
    const data = this.loadDataFromStorage(props.tile.id);
    this.slackData = new SlackData(this.props.swipes, data, this.dataDelegate);
  }
  loadDataFromStorage(tileId){
    const data = {};
    data.selectedChannelId = localStorage.getItem(tileId + '-selectedChannelId');
    const unsentMessages = localStorage.getItem(tileId + '-unsentMessageQueue');
    if(unsentMessages){
      data.unsentMessageQueue = JSON.parse(unsentMessages);
    }
    return data;
  }
  dataDelegate(data){
    let itemId;
    if(data.selectedChannelId){
      itemId = this.props.tile.id + '-selectedChannelId';
      localStorage.setItem(itemId, data.selectedChannelId);
    }
    if(data.unsentMessageQueue){
      itemId = this.props.tile.id + '-unsentMessageQueue';
      localStorage.setItem(itemId, JSON.stringify(data.unsentMessageQueue));
    }
    this.setState(data);
  }
  addListenersToSwipes(swipes){
    swipes.addListener('share.receivedData', (data) => {
      var input = '<' + data.shareUrl;
      if(data.title){
        input += '|' + data.title;
      }
      input += '>';
      this.slackData.sendMessage(input);
    });
    swipes.addListener('menu.pressed', () => {
      if(this.refs.sidemenu){
        this.refs.sidemenu.togglePin();
      }
    })
  }
  unreadAbove(unread){
    if(this.state.unreadAbove !== unread){
      this.setState({unreadAbove: unread});
    }
  }
  componentDidMount(){

  }
  componentWillUnmount(){
    this.slackData.destroy();
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
  onCardShare(card, data){
    const { swipes } = this.props;

    const shareData = {};
    if(data.shortUrl){
      shareData.short_url = data.shortUrl;
      // Is a swipes url to reshare
    }
    else if(data.id && data.type){
      shareData.link = {
        service: 'slack',
        id: data.id,
        type: data.type
      }
      shareData.meta = data;
      shareData.permission = {
        type: 'public',
        account_id: swipes.info.workflow.selectedAccountId
      }
      // Is a slack object
    }
    if(Object.keys(shareData).length){
      swipes.sendEvent('share', shareData);
    }
  }
  onCardAction(card, data, action){
    console.log('action', data, action);
  }
  onCardClick(card, data){
    console.log('clicked', data);
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
        style={{paddingBottom: '90px'}}
        ref="sidemenu"
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
    if(command === 'swipes://retry-send'){
      return this.slackData.sendMessage();
    }
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
          cardDelegate={this}
          sections={sortedMessages}
          markAsRead={this.slackData.markAsRead}
          loadingMessages={this.state.loadingMessages}
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
