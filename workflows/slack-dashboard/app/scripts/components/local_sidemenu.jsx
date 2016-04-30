var React = require('react');
var Sidemenu = require('./sidemenu');
var channelStore = require('../stores/ChannelStore');
var chatStore = require('../stores/ChatStore');

var LocalSidemenu = React.createClass({
	mixins: [channelStore.connect('channels')],
	render: function() {
		var channels = channelStore.getActive();
		if(channels.length){
			var navItems = [];
			var currentChatId = chatStore.get('channelId');

			var channelsCol = [];
			var peopleCol = [];
			_.each(channels, function(channel){

				var item = { id: channel.id, name: channel.name };
				if(currentChatId === channel.id){
					item.active = true;
				}
				if(channel.unread_count_display){
					item.unread = true;
					item.notificationCount = channel.unread_count_display;
					if(channel.is_im){ // K_TODO: This should also be triggered on channels if mentioned....
						
					}
				}
				if(channel.is_im){
					peopleCol.push(item);
				}
				else{
					channelsCol.push(item);
				}
			});
			var channels = channelsCol.concat(peopleCol);
		}
		return (
			<Sidemenu data={{rows: channels}} {...this.props} />
		);
	}
});

module.exports = LocalSidemenu;