var React = require('react');
var Reflux = require('reflux');
var chatStore = require('../stores/ChatStore');
var chatActions = require('../actions/ChatActions');
var ChatItem = require('./chat_item');
var ChatInput = require('./chat_input');

var ChatList = React.createClass({
	mixins: [Reflux.connect(chatStore, "sections")],
	shouldScrollToBottom: true,
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
	scrollToBottom: function(dontAnimate){
		var scrollPosForBottom = $('.chat-list').outerHeight() - $('.chat-list-container').outerHeight() 
		if(this.shouldScrollToBottom && scrollPosForBottom != $('.chat-list-container').scrollTop() ){
			if(dontAnimate)
				$('.chat-list-container').scrollTop(scrollPosForBottom);
			else
				$('.chat-list-container').animate({ scrollTop: scrollPosForBottom }, 200);
		}
		var topPadding = 0;
		if($('.chat-list').outerHeight() < $('.chat-list-container').outerHeight())
			topPadding = $('.chat-list-container').outerHeight() - $('.chat-list').outerHeight();
		$('.chat-list-container').css("paddingTop", topPadding + "px");
		
	},
	handleResize: function(){
		this.scrollToBottom();
	},
	onChangedTextHeight: function(height){
		$("#content").css("paddingBottom", height);
		this.scrollToBottom();
	},
	onSendingMessage:function(){
		this.shouldScrollToBottom = true;
	},
	componentDidUpdate: function(){
		this.scrollToBottom();
	},
	componentDidMount: function(){
		window.addEventListener('resize', this.handleResize);
	},
	componentWillUnmount: function() {
		window.removeEventListener('resize', this.handleResize);
	},
	render: function() {

		var sections = this.state.sections.map(function(section){
			return <ChatList.Section key={section.title} data={section} />
		})
		return (
			<div onScroll={this.onScroll} ref="scroll-container" className="chat-list-container">
				<div className="chat-list">
					{sections}
				</div>
				<ChatList.Input onSendingMessage={this.onSendingMessage} onChangedTextHeight={this.onChangedTextHeight} />
			</div>
		);
	}
});



ChatList.Section = React.createClass({
	render: function() {
		var chatItems = this.props.data.messages.map(function(item){
			return <ChatList.ChatItem key={item.ts} data={item} />;
		});
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
ChatList.Input = ChatInput;


ChatList.ChatItem = ChatItem;


module.exports = ChatList;
