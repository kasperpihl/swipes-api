var React = require('react');
var Reflux = require('reflux');
var chatStore = require('../stores/ChatStore');
var chatActions = require('../actions/ChatActions');
var channelStore = require('../stores/ChannelStore');
var _ = require('underscore');
var ChatList = React.createClass({
	mixins: [channelStore.connectFilter('channels', function(channels){
		/*
			Filter only to the channels that has 
		*/
		if(!channels || !_.size(channels))
			return [];
		channels = _.values(channels);
		return channels.filter(function(channel) {
			if(!channel.is_archived && channel.unread_count){
				if(channel.is_member || channel.is_open){
					return true;
				}
			}
			return false;
		});
	})],
	renderChannels: function(){

		return this.state.channels.map(function(channel){

			return <ChatList.Section key={channel.id} data={channel} />
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
	render: function(){
		return (
			<div className="section">
				<h2>{this.props.data.title}</h2>
			</div>
		);
	}
});

module.exports = ChatList;
;