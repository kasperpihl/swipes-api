import React, { Component, PropTypes } from 'react'
import './styles/main.scss'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../constants/ActionTypes'
import { bindAll } from '../../classes/utils'
import Sidemenu from '../../components/sidemenu/Sidemenu'

import SlackData from './slack-data'
import SlackTileHandler from './slack-tile-handler'

import ChatList from './ChatList'
import ChatInput from './ChatInput'

class Chat extends Component {
  constructor(props) {
    super(props)    

    bindAll(this, ['sendMessage', 'onSelectedRow', 'changedHeight', 'addListenersToSwipes', 'dataDelegate', 'unreadAbove', 'clickedLink', 'onCardShare', 'onCardAction'])
    this.addListenersToSwipes(props.swipes);
    this.slackHandler = new SlackTileHandler(props.swipes, props.tile, this.dataDelegate);
    this.state = { started: false, isStarting: false, inputHeight: 60, data: this.slackHandler.getData() }
    
    //const data = this.loadDataFromStorage(props.tile.id);
    //this.slackData = new SlackData(this.props.swipes, data, this.dataDelegate);

  }
  dataDelegate(data){
    if(!this.mounted){
      return;
    }
    this.setState({data});
  }
  addListenersToSwipes(swipes){
    swipes.addListener('share.receivedData', (data) => {
      var input = '<' + data.shareUrl;
      if(data.title){
        input += '|' + data.title;
      }
      input += '>';
      this.slackHandler.sendMessage(input);
      this.refs['chat-list'].forceScrollToBottom = true;
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
    this.mounted = true;
  }
  componentWillUnmount(){
    this.mounted = false;
    this.slackHandler.destroy();
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
    this.refs['chat-list'].forceScrollToBottom = true;
    this.slackHandler.sendMessage(message);
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
    //console.log(this.shareDataForChecksum[data.checksum]);
    if(data.shortUrl){
      const folder = localStorage.getItem('dropbox-folder');
      data = swipesUrlProvider.get(data.shortUrl);
      if(folder){
        var path = folder + data.subtitle + '/' + data.title;
        console.log('opening', window.ipcListener.sendEvent('showItemInFolder', path));
      }
    }

    console.log('clicked', data);
  }
  onSelectedRow(row){
    this.slackHandler.setChannel(row.id);
    document.getElementById('chat-input').focus();
  }
  renderSidemenu(){
    // K_TODO: Update to use internal state;
    const { data } = this.state;
    const sectionsSidemenu = data.get('sectionsForSidemenu') || [];;
    //this.state.sectionsSidemenu || [];
    if(!sectionsSidemenu.length){
      return;
    }
    return (
      <Sidemenu
        style={{paddingBottom: '10px'}}
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
      return this.slackHandler.sendMessage();
    }
    const { swipes } = this.props;
    swipes.sendEvent('openURL', {url: command})
  }
  render() {
    let { data } = this.state;
    const { typingLabel, inputHeight } = this.state;
    let paddingBottom = inputHeight + 20;
    if(typingLabel){
      // paddingBottom += 14;
    }
    return (
      <div style={{position: 'relative', height :'100%', paddingBottom: paddingBottom + 'px'}}>
        {this.renderSidemenu()}
        {this.renderUnreadAbove()}
        <ChatList
          ref="chat-list"
          cardDelegate={this}
          sections={data.get('sortedMessages')}
          markAsRead={this.slackHandler.markAsRead}
          loadingMessages={data.get('loadingMessages')}
          unreadAbove={this.unreadAbove}
          unreadIndicator={data.get('unreadIndicator')}
          clickedLink={this.clickedLink}
        />
        <ChatInput
          sendMessage={this.sendMessage}
          changedHeight={this.changedHeight}
          uploadFiles={this.slackHandler.uploadFiles}
          sendTypingEvent={this.slackHandler.sendTypingEvent}
        />
        {this.renderTypingIndicator(data.get('typingLabel'))}
      </div>
    )
  }
}

export default Chat;
