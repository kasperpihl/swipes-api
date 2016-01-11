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
    getInitialState: function() {
       return {
           replyState: 'hidden'
       }  
    },
	markChannel: function(){
		channelActions.markAsRead(this.props.data.channel);
	},
    reply: function() {
        this.setState({replyState: "reply-input"});
    },
	renderMessages:function(){
		return this.props.data.channel.messages.map(function(message){
			return <ChatList.Item key={message.ts} data={message} />;
		});
	},
    renderInput: function() {
        return <div className={this.state.replyState}>
                    <input type="text" className="chat-reply-input" placeholder="Here you can reply" />
                </div>
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
            channelClass += " direct-message";
            channelName = '@' + channel.name;
        } else if (channel.id.charAt(0) === "C") {
            channelClass += " channel-message";
            channelName = '#' + channel.name;
        } else if (channel.id.charAt(0) === "G") {
            channelClass += " group-message"
            channelName = channel.name;            
        }
        
		return (
			<div className={channelClass}>
                <h5>{channelName}</h5>
				<h6>{channel.unread_count}</h6>
				{this.renderMessages()}
                {this.renderActions()}
                {this.renderInput()}
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