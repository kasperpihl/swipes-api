var React = require('react');
var Reflux = require('reflux');
var chatStore = require('../stores/ChatStore');
var chatActions = require('../actions/ChatActions');
var userStore = require('../stores/UserStore');
var channelStore = require('../stores/ChannelStore');
var channelActions = require('../actions/ChannelActions');
var _ = require('underscore');
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
			// Sort function
			if(!channel.messages || !channel.messages.length){
				return 0;
			}
			return -_.last(channel.messages).ts;
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
	markChannel: function(){
		var channel = this.props.data.channel;
		var channelID = this.props.data.channel.id;
		var channelHeight =  $('#' + channelID).height();
		$('#' + channelID).css('height', channelHeight + 'px');
		$('#' + channelID).animate({height:0},400);
		$('#' + channelID).addClass('read').delay(350).queue(function(){
			channelActions.markAsRead(channel);
		});
	},
	renderMessages:function(){
		var me = this.props.data.me;
		
		return this.props.data.channel.messages.map(function(message){
			return <ChatList.Item key={message.ts} data={{me:me, message:message}} />;
		});
	},
	renderChannelName: function() {
		var channel = this.props.data.channel;

		return <h5 className="channel-name">
		<div className="channel-sign">#
			<p className="unread-count">{channel.unread_count_display}</p>
		</div>
		{channel.name}</h5>
	},
	renderMarkRead: function(){
		var channel = this.props.data.channel;
		return (
			<div className="channel-mark-read">
				<a onClick={this.markChannel}>Mark read</a>
			</div>
		);
	},
	renderReply: function(){
		return (
			<div className="quick-reply">
				<input type="text" ref="replyField" onKeyUp={this.onKeyUp} className="chat-reply-input" placeholder="Quick reply" />
			</div>
		);
	},
	sendMessage: function(message){
		$(this.refs.replyField).val("");
		channelActions.sendMessage(this.props.data.channel, message);
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
					{this.renderChannelName()}
					{this.renderMarkRead()}
				</div>
				{this.renderMessages()}
				{this.renderReply()}
			</div>
		);
	}
});

ChatList.Item = React.createClass({
	renderProfilePicture: function(){

	},
	renderName: function(){

	},
	render:function(){
		var name = 'unknown';
		var message = this.props.data.message;
		var user = userStore.get(message.user);
		var className = "item ";
		if(user){
			if(user.id === this.props.data.me)
				className += 'my-message';
			name = user.name;
		}
		return (
			<div className={className}>
				<span><span className="username fw-500">{name}:</span> <span className="message-content">{message.text}</span></span>

			</div>
		);
	}
})

module.exports = ChatList;