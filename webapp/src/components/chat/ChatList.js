var React = require('react');
var Reflux = require('reflux');
var chatStore = require('../stores/ChatStore');
var chatActions = require('../actions/ChatActions');
var ChatItem = require('./chat_item');
var ChatInput = require('./chat_input');
var channelStore = require('../stores/ChannelStore');
var CircularProgress = require('material-ui/lib/circular-progress');
var LocalSidemenu = require('./local_sidemenu');

var ChatList = React.createClass({
  mixins: [chatStore.connect('chat'), chatStore.connect(), channelStore.connect()],
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
  checkForcedSidemenu: function(){
    var forcedSmallSidemenu = false;
    if(document.body.clientWidth < 600){
      forcedSmallSidemenu = true;
    }
    if(this.state.forcedSmallSidemenu != forcedSmallSidemenu){
      this.setState({forcedSmallSidemenu: forcedSmallSidemenu});
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
    if(chatList.clientHeight < scrollContainer.clientHeight)
      topPadding = scrollContainer.clientHeight - chatList.clientHeight;
    $('.chat-list-container').css("paddingTop", topPadding + "px");
  },
  handleResize: function(){
    this.bouncedScroll(this.hasRendered);
    this.bouncedSidemenuCheck();
  },
  onSendingMessage:function(){
    this.shouldAnimateScroll = true;
    this.shouldScrollToBottom = true;
  },
  componentDidUpdate: function(prevProps, prevState){
    this.scrollToBottom(this.hasRendered);
    chatActions.updateBadge();
  },
  componentDidMount: function(){
    this.bouncedSidemenuCheck = _.debounce(this.checkForcedSidemenu, 30);
    this.bouncedScroll = _.debounce(this.scrollToBottom, 100);
    this.bouncedMarkAsRead = _.debounce(chatActions.markAsRead, 500);
    window.addEventListener('resize', this.handleResize);
  },
  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },
  onSelectedRow: function(row){
    chatActions.setChannel(row.id);
    document.getElementById('chat-input').focus();
    var newSettings = {channelId: row.id};
    swipes.api.request('users.updateWorkflowSettings', {workflow_id: swipes.info.workflow.id, settings: newSettings})
    swipes.info.workflow.settings.channelId = row.id;
  },
  renderLoading: function(){
    if(!this.state.chat.sections){
      return (<CircularProgress color="#777" size={1} style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        margin: 0,
        marginTop: '-25px',
        marginLeft: '-25px'
      }}/>)
    }
  },
  renderSections: function(){
    if(this.state.chat.sections){
      var showingUnread = this.state.chat.showingUnread;
      var isMarked = this.state.chat.showingIsRead;
      return this.state.chat.sections.map(function(section){
        return <ChatList.Section key={section.title} data={{isMarked: isMarked, showingUnread: showingUnread, section: section}} />
      });
    }
  },
  onRenderInputHeight: function(height){
    if(height !== this.state.inputHeight){
      this.shouldAnimateScroll = true;
      this.shouldScrollToBottom = true;
      this.setState({inputHeight: height});
    }
  },
  renderInput: function(){
    return <ChatInput onRenderingInputHeight={this.onRenderInputHeight} onSendingMessage={this.onSendingMessage} />
  },
  onSidemenuWidthChanged:function(newWidth){
    this.setState({sidemenuWidth: newWidth});
  },
  renderTyping: function() {
    if(this.state.typing) {
      return (
        <div className="typing-indicator">{this.state.typing}</div>
      )
    }
  },
  render: function() {
    if(!swipes.info.workflow){
      return <CircularProgress size={1} color="#777" style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        margin: 0,
        marginTop: '-25px',
        marginLeft: '-25px'
      }}/>;
    }
    // K_TODO: Test if this works without channel
    var paddingLeft = 30;
    if(this.state.sidemenuWidth){
      paddingLeft = this.state.sidemenuWidth + "px";
    }
    if(this.state.forcedSmallSidemenu){
      paddingLeft = "30px";
    }
    var sideHeight = "calc(100% - " + this.state.inputHeight + "px)";
    return (
      <div className="card-container" style={{paddingLeft: paddingLeft, paddingBottom: this.state.inputHeight + 'px' }}>
        <LocalSidemenu onWidthChanged={this.onSidemenuWidthChanged} onSelectedRow={this.onSelectedRow} style={{height: sideHeight}}/>
        <div onScroll={this.onScroll} ref="scroll-container" className="chat-list-container">
          {this.renderLoading()}
          <div className="chat-list" ref="chat-list">
            {this.renderSections()}
            {this.renderTyping()}
          </div>
        </div>
        {this.renderInput()}
      </div>
    );
  }
});

module.exports = ChatList;
