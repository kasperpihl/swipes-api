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

    bindAll(this, ['sendMessage', 'onSelectedRow', 'changedHeight', 'addListenersToSwipes', 'dataDelegate'])
    this.addListenersToSwipes(props.swipes);
    this.slackData = new SlackData(this.props.swipes, {}, this.dataDelegate);
  }
  dataDelegate(data){
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
  }
  createItemDelegate(){
    const { swipes } = this.props;
    return {
      editMessage: this.slackData.editMessage,
      deleteMessage: this.slackData.deleteMessage,
      openImage: this.slackData.openImage,
      loadPrivateImage: this.slackData.loadPrivateImage,
      clickLink: (url) => swipes.sendEvent('openURL', {url: url}),
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
  renderTypingIndicator(label){
    
    if(label){
      return (
        <div className="typing-indicator">{label}</div>
      )
    }
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
        <ChatList 
          sections={sortedMessages} 
          markAsRead={this.slackData.markAsRead} 
          unreadIndicator={this.state.unreadIndicator} 
          itemDelegate={this.createItemDelegate()} 
        />
        <ChatInput
          sendMessage={this.sendMessage} 
          changedHeight={this.changedHeight} 
          uploadFiles={this.slackData.uploadFiles}
        />
        {this.renderTypingIndicator(typingLabel)}
      </div>
    )
  }
}

export default Chat;