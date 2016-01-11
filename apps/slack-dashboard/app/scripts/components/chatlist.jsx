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
			if(!channel.is_archived && channel.unread_count){ // && channel.unread_count 
				if(channel.is_member || channel.is_open){
					return true;
				}
			}
			return false;
		}), function(channel){
			if(!channel.messages || !channel.messages.length){
				return 0;
			}
			return -channel.messages[0].ts;
		});
	})],
	renderChannels: function(){

		return this.state.channels.map(function(channel){

			return <ChatList.Section key={channel.id} data={{channel:channel}} />
		});
	},
	render: function() {
		return (
			<div ref="scroll-container" className="chat-list-container">
				{this.renderChannels()}
			</div>
		);
	}
});


ChatList.Section = React.createClass({

	markChannel: function(){
		channelActions.markAsRead(this.props.data.channel);
	},
	renderMessages:function(){
		return this.props.data.channel.messages.map(function(message){
			return <ChatList.Item key={message.ts} data={message} />;
		});
	},
	renderActions: function(){
		return (
			<div className="channel-actions">
				<a onClick={this.reply}>Reply</a>
				<a onClick={this.markChannel}>Mark read</a>
			</div>
		);
	},
	render: function(){
		var channel = this.props.data.channel;
        var channelClass = "channel-section";
        if (channel.id.charAt(0) === "D") {
            channelClass += " direct-message"
        } else if (channel.id.charAt(0) === "C") {
            channelClass += " channel-message"
        } else if (channel.id.charAt(0) === "G") {
            channelClass += " group-message"
        }
        
		return (
			<div className={channelClass}>
				{this.renderActions()}
				<h6>{channel.unread_count} {channel.name} </h6>
				{this.renderMessages()}
			</div>
		);
	}
});

ChatList.Item = React.createClass({
	render:function(){
		var name = 'unknown';
		var user = userStore.get(this.props.data.user);
		if(user){
			name = user.name;
		}
		return (
			<div className="item">
				<span>{this.props.data.ts}: {this.props.data.text}</span>

			</div>
		);
	}
})

module.exports = ChatList;