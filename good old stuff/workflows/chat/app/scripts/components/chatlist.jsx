var React = require('react');
var Reflux = require('reflux');
var chatStore = require('../stores/ChatStore');
var chatActions = require('../actions/ChatActions');
var ChatItem = require('./chat_item');
var ChatInput = require('./chat_input');

var ChatList = React.createClass({
	mixins: [chatStore.connect()],
	shouldScrollToBottom: true,
	hasRendered: false,
	onScroll: function(e){
		var contentHeight = $('.chat-list').outerHeight()
		var scrollPos = $('.chat-list-container').scrollTop()
		var viewHeight = $('.chat-list-container').outerHeight()

		if( (viewHeight+scrollPos) >= contentHeight ){
			this.shouldScrollToBottom = true;
		}
		else{
			this.shouldScrollToBottom = false;
		}
	},
	scrollToBottom: function(animate){
		var scrollPosForBottom = $('.chat-list').outerHeight() - $('.chat-list-container').outerHeight()
		if(scrollPosForBottom > 0 && this.shouldScrollToBottom && scrollPosForBottom != $('.chat-list-container').scrollTop() ){
			this.hasRendered = true;
			if(animate)
				$('.chat-list-container').animate({ scrollTop: scrollPosForBottom }, 300);
			else
				$('.chat-list-container').scrollTop(scrollPosForBottom);
		}
		var topPadding = 0;
		if($('.chat-list').outerHeight() < $('.chat-list-container').outerHeight())
			topPadding = $('.chat-list-container').outerHeight() - $('.chat-list').outerHeight();
		$('.chat-list-container').css("paddingTop", topPadding + "px");
	},
	handleResize: function(){
		this.scrollToBottom(this.hasRendered);
	},
	onChangedTextHeight: function(height){
		//console.log("changing text height");
		$("#content").css("paddingBottom", height);
		this.scrollToBottom();
	},
	onSendingMessage:function(){
		this.shouldAnimateScroll = true;
		this.shouldScrollToBottom = true;
	},
	componentDidUpdate: function(prevProps, prevState){
		if(this.state.thread != prevState.thread)
			this.hasRendered = false;
		this.scrollToBottom(this.hasRendered);
	},
	componentDidMount: function(){
		window.addEventListener('resize', this.handleResize);
	},
	componentWillUnmount: function() {
		window.removeEventListener('resize', this.handleResize);
	},
	renderThreadHeader: function(){
		if(!this.state.thread)
			return '';
		return <ChatList.ThreadHeader data={{thread: this.state.thread}} />
	},
	renderLoading: function(){
		if(this.state.sections){
			return '';
		}
		
		return <div>Loading</div>
	
	},
	renderSections: function(){
		if(!this.state.sections){
			return '';
		}

		return this.state.sections.map(function(section){
			return <ChatList.Section key={section.title} data={section} />
		});

	},
	renderInput: function(){
		return <ChatInput data={{channel: swipes.info.channel, thread: this.state.thread}} onSendingMessage={this.onSendingMessage} onChangedTextHeight={this.onChangedTextHeight} />
	},
	render: function() {
		
		return (
			<div onScroll={this.onScroll} ref="scroll-container" className="chat-list-container">
				{this.renderThreadHeader()}
				<div className="chat-list">
					{this.renderLoading()}
					{this.renderSections()}
					
				</div>
				{this.renderInput()}
			</div>
		);
	}
});
ChatList.ThreadHeader = React.createClass({
	onClick: function(){
		chatActions.unsetThread();
	},
	render: function(){
		return (
			<div className="thread-header">
				<a onClick={this.onClick}>Clear </a>
				Thread: {this.props.data.thread.title}
			</div>
		);
	}
});
ChatList.Section = React.createClass({
	render: function() {
		var chatItemsGroups = [];
		var chatItemMessages = [];

		this.props.data.messages.forEach(function (item) {
			if (item.isExtraMessage === false) {
				if (chatItemMessages.length > 0) {
					chatItemsGroups.push(chatItemMessages);
					chatItemMessages = [];
				}

				chatItemMessages.push(item);
			} else {
				chatItemMessages.push(item);
			}
		});

		// Push the last messages to a group
		chatItemsGroups.push(chatItemMessages);

		var chatItems  = chatItemsGroups.map(function (item) {
			return <ChatItem key={item[0].ts} data={item} />;
		})

		return (
			<div className="section">
				<div className="chat-date-line">
					<div className="line"></div>
					<div className="date">
						<span>{this.props.data.title}</span>
					</div>
				</div>
				{chatItems}
			</div>
		);
	}
});

module.exports = ChatList;
;