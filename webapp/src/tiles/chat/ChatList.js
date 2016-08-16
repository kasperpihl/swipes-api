import React, { Component, PropTypes } from 'react'
import ChatSection from './ChatSection'

class ChatList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div>
      </div>
    )
  }
}
export default ChatList

ChatList.propTypes = {
  removeThis: PropTypes.string.isRequired
}


var React = require('react');
var Reflux = require('reflux');
var chatStore = require('../stores/ChatStore');
var chatActions = require('../actions/ChatActions');
var ChatItem = require('./chat_item');
var ChatInput = require('./chat_input');
var channelStore = require('../stores/ChannelStore');

var ChatList = React.createClass({
  shouldScrollToBottom: true,
  hasRendered: false,
  getInitialState() {
      return {
          inputHeight:70
      };
  },
  onScroll: function(e){
    var contentHeight = this.refs['chat-list'].clientHeight
    var scrollPos = this.refs['scroll-container'].scrollTop
    var viewHeight = this.refs['scroll-container'].clientHeight

    if( (viewHeight+scrollPos) >= contentHeight ){
      this.shouldScrollToBottom = true;
    }
    else{
      this.shouldScrollToBottom = false;
    }

    this.checkForMarkingAsRead();
  },
  checkForMarkingAsRead: function(){
    // Check for unread marker
    var scrollPos = this.refs['scroll-container'].scrollTop
    var viewHeight = this.refs['scroll-container'].clientHeight
    if($('.new-message-header').length){
      var posForUnread = $('.new-message-header').position().top - scrollPos;
      if(posForUnread > 0 && posForUnread < viewHeight){
        this.bouncedMarkAsRead()
      }
    }
  },
  scrollToBottom: function(animate){
    const chatList = this.refs['chat-list']
    const scrollContainer = this.refs['scroll-container'];

    var scrollPosForBottom = chatList.clientHeight - scrollContainer.clientHeight
    if(scrollPosForBottom > 0 && this.shouldScrollToBottom && scrollPosForBottom != scrollContainer.scrollTop ){
      this.hasRendered = true;
      if(animate){
        $('.chat-list-container').animate({ scrollTop: scrollPosForBottom }, 50);
      }
      else{
        scrollContainer.scrollTop = scrollPosForBottom;
      }
    }
    var topPadding = 0;
    if(chatList.clientHeight < scrollContainer.clientHeight){
      topPadding = scrollContainer.clientHeight - chatList.clientHeight;
      if(topPadding != this.state.topPadding){
        this.setSate({})
      }
    }
    $('.chat-list-container').css("paddingTop", topPadding + "px");
  },
  handleResize: function(){
    this.bouncedScroll(this.hasRendered);
  },
  onSendingMessage:function(){
    this.shouldAnimateScroll = true;
    this.shouldScrollToBottom = true;
  },
  componentDidUpdate: function(prevProps, prevState){
    this.scrollToBottom(this.hasRendered);
  },
  componentDidMount: function(){
    this.bouncedScroll = _.debounce(this.scrollToBottom, 100);
    this.bouncedMarkAsRead = _.debounce(chatActions.markAsRead, 500);
    window.addEventListener('resize', this.handleResize);
  },
  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },
  renderLoading: function(){
    if(!this.state.chat.sections){
      return <div>Loading</div>
    }
  },
  renderSections: function(){
    if(this.state.chat.sections){
      var showingUnread = this.state.chat.showingUnread;
      var isMarked = this.state.chat.showingIsRead;
      return this.state.chat.sections.map(function(section){
        return <ChatSection key={section.title} data={{isMarked: isMarked, showingUnread: showingUnread, section: section}} />
      });
    }
  },
  renderInput: function(){
    return <ChatInput onRenderingInputHeight={this.onRenderInputHeight} onSendingMessage={this.onSendingMessage} />
  },
  renderTyping: function() {
    if(this.state.typing) {
      return (
        <div className="typing-indicator">{this.state.typing}</div>
      )
    }
  },
  render: function() {
    var sideHeight = "calc(100% - " + this.state.inputHeight + "px)";
    return (
      <div onScroll={this.onScroll} ref="scroll-container" className="chat-list-container">
        {this.renderLoading()}
        <div className="chat-list" ref="chat-list">
          {this.renderSections()}
          {this.renderTyping()}
        </div>
      </div>
    );
  }
});

module.exports = ChatList;
