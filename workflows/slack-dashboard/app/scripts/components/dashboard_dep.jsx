var React = require('react');
var Reflux = require('reflux');
var chatStore = require('../stores/ChatStore');
var chatActions = require('../actions/ChatActions');
var userStore = require('../stores/UserStore');
var channelStore = require('../stores/ChannelStore');
var chatActions = require('../actions/ChatActions');
var _ = require('underscore');
var TimeAgo = require('./time_ago');
var ChatList = React.createClass({
	mixins: [channelStore.connectFilter('channels', function(channels){
		/*
			Filter only to the channels that has 
		*/
		if(!channels || !_.size(channels))
			return [];
		channels = _.values(channels);
		return _.sortBy(channels.filter(function(channel) {
			// Filter function
			if(!channel.is_archived && channel.unread_count_display){
				if(channel.is_member || channel.is_open){
					return true;
				}
			}
			return false;
		}), function(channel){
			return channel.name;
		});
	})],
	renderChannels: function(){
		var me = userStore.me();
		if(me){
			me = me.id;
		}
		return this.state.channels.map(function(channel){

			return <ChatList.Section key={channel.id} data={{me: me, channel:channel}} />
		});
	},
	renderEmptyChat: function(){
		if(!this.state.channels.length){
			return (
				<div className="no-new-messages">
					<h1>No new messages. Add the trumpet here maybe</h1>
				</div>
			);
		}
	},
	render: function() {
		return (
			<div ref="scroll-container" className="chat-list-container">
				{this.renderChannels()}
				{this.renderEmptyChat()}
			</div>
		);
	}
});


ChatList.Section = React.createClass({
	getInitialState: function(){
		return {
			'showReply': false
		};
	},
	componentDidUpdate: function(){
		if(this.state.showReply){
			$(this.refs.replyField).focus();
		}
	},
	markChannel: function(){
		var channel = this.props.data.channel;
		var channelID = this.props.data.channel.id;
		var channelHeight =  $('#' + channelID).height();
		$('#' + channelID).css('height', channelHeight + 'px');
		$('#' + channelID).animate({height:0},400);
		$('#' + channelID).addClass('read').delay(350).queue(function(){
			chatActions.markAsRead(channel);
		});
	},
	openReplyField: function(){
		this.setState({showReply: true});
	},
	renderTimeAgo: function(){
		var date = new Date(parseInt(_.last(this.props.data.channel.messages).ts)*1000);

		return (
			<div className="channel-timeago">
				<TimeAgo className="timeago" date={date} />
			</div>
		)
	},

	renderNewMessageHeader: function(){
		return <div key="new-message-header" className='new-message-header'>----- New Messages ------</div>;
	},
	renderHeaderForMessage: function(message, isOldMessage){

		if(this.lastUser && message.user === this.lastUser){
			return null;
		}
		var className = "chat-user-header ";
		if(isOldMessage){
			className += 'old-message';
		}
		this.lastUser = message.user;
		var name = 'unknown';
		var user = userStore.get(message.user);
		if(user){
			name = user.name;
		}
		return <div key={"message-header-"+message.ts} className={className}>{name} wrote:</div>;
	},
	renderMessageList:function(){
		var me = this.props.data.me;
		var self = this;
		var isNew = false;
		var channel = this.props.data.channel;
		var messageList = [];
		this.lastUser = null;
		_.each(channel.messages, function(message){
			var isOldMessage = !isNew;
			if(!isNew && message.ts > channel.last_read){
				isOldMessage = false;
				isNew = true;
				messageList.push(self.renderNewMessageHeader());
			}
			var header = self.renderHeaderForMessage(message, isOldMessage);
			if(header){
				messageList.push(header);
			}

			var isMe = (message.user === me);

			messageList.push(<ChatList.Item key={message.ts} data={{isMe: isMe, isOld: isOldMessage, message:message}} />);	
		});
		return messageList;
	},
	renderChannelName: function() {
		var channel = this.props.data.channel;

		return <h5 className="channel-name">{channel.name}</h5>
	},
	renderMarkRead: function(){
		var channel = this.props.data.channel;
		return (
			<div className="channel-actions">
				<a onClick={this.openReplyField}>Reply</a>
				<a onClick={this.markChannel}>Mark read</a>
			</div>
		);
	},
	renderReply: function(){
		var className = "quick-reply ";
		if(!this.state.showReply){
			className += 'hidden';
		}
		return (
			<div className={className}>
				<input type="text" ref="replyField" onBlur={this.onBlur} onKeyUp={this.onKeyUp} className="chat-reply-input" placeholder="Reply" />
			</div>
		);
	},
	sendMessage: function(message){
		$(this.refs.replyField).val("");
		chatActions.sendMessage(this.props.data.channel, message);
	},
	onBlur: function(){
		this.setState({showReply: false});
	},
	onKeyUp: function(e){
		var $textField = $(this.refs.replyField);
		//console.log(e.keyCode, e.shiftKey, e.target);
		if(e.keyCode === 27){
			$textField.blur();
		}
		if (e.keyCode === 13 && !e.shiftKey ) {
			var message = $textField.val();
			if(message && message.length > 0){
				this.sendMessage(message);
			}
			else{
				this.markChannel();
			}
		}
	},
	render: function(){
		var channel = this.props.data.channel;
		var channelClass = "channel-section";
		if (channel.id.charAt(0) === "D") {
			channelClass += " direct-message";
		} else if (channel.id.charAt(0) === "C") {
			channelClass += " channel-message";
		} else if (channel.id.charAt(0) === "G") {
			channelClass += " group-message"        
		}

		return (
			<div className={channelClass} id={channel.id}>
				<div className="channel-header">
					{this.renderTimeAgo()}
					{this.renderChannelName()}
					{this.renderMarkRead()}
				</div>
				{this.renderReply()}
				{this.renderMessageList()}
			</div>
		);
	}
});

ChatList.Item = React.createClass({
	renderText: function(){

	},
	renderAttachment: function(){
		
	},
	render:function(){
		
		var message = this.props.data.message;
		
		var className = "item ";
		// The message was already read (we always include the last read message to provide context of what the response was for)
		if(this.props.data.isOld){
			className += 'old-message ';
		}
		if(this.props.data.isMe){
			className += 'my-message ';
		}

		return (
			<div className={className}>
				<span><span className="message-content">{message.text}</span></span>
			</div>
		);
	}
})

module.exports = ChatList;