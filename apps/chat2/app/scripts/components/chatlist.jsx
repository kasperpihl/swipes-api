var React = require('react');
var Reflux = require('reflux');
var chatStore = require('../stores/ChatStore');
var chatActions = require('../actions/ChatActions');
var ChatItem = require('./chat_item');

var ChatList = React.createClass({
	mixins: [Reflux.connect(chatStore, "sections")],
	shouldScrollToBottom: true,
	isScrolledToBottom: false,
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
	scrollToBottom: function(){
		var scrollPosForBottom = $('.chat-list').outerHeight() - $('.chat-list-container').outerHeight() 
		$('.chat-list-container').scrollTop(scrollPosForBottom);
		this.isScrolledToBottom = true;
	},
	componentDidUpdate: function(){
		if(this.shouldScrollToBottom)
			this.scrollToBottom();
	},
	render: function() {

		var sections = this.state.sections.map(function(section){
			return <ChatList.Section key={section.title} data={section} />
		})
		return (
			<div onScroll={this.onScroll} className="chat-list-container">
				<div className="chat-list">
					{sections}
				</div>
				<div className="chat-input-container">
					<ChatList.Input />
				</div>
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
				<div className="line" title={this.props.data.title}></div>
				
				{chatItems}
			</div>
		);
	}
});

ChatList.Input = React.createClass({
	onKeyUp: function(e){
		//console.log(e.keyCode, e.shiftKey, e.target);
		if(e.keyCode === 13){
			var message = $(e.target).val();
			if(message && message.length > 0){
				$(e.target).val("");
				chatActions.sendMessage(message);
			}
		}
	},
	render: function() {
		return (
			<div className="input-container">
				{/* <input type="file" id="file-input" /> 
				<div className="attach-button-container">
				</div>*/}
				<i className="material-icons chat-input-attach-icon">attach_file</i>
				<textarea data-autoresize tabIndex="1" onKeyUp={this.onKeyUp} id="new-message-textarea" rows="1" placeholder="Your message"></textarea>  
			</div>
		);
	}
});


ChatList.ChatItem = ChatItem;


module.exports = ChatList;
