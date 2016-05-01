var React = require('react');
var Sidemenu = require('./sidemenu');
var channelStore = require('../stores/ChannelStore');
var chatStore = require('../stores/ChatStore');
/*
	Purpose of this class is to handle all channels,
	I've seperated this part so later we can easier make the sidemenu standalone, so others can integrate it.
 */
var LocalSidemenu = React.createClass({
	mixins: [channelStore.connect('channels')],
	componentDidMount:function() {
		swipes.onMenuButton(function(){
			this.refs.sidemenu.togglePin();
		}.bind(this));
	},
	render: function() {
		var channels = channelStore.getActive();

		if(channels.length){
			var navItems = [];
			var currentChatId = chatStore.get('channelId');

			var channelsCol = [];
			var peopleCol = [];
			_.each(channels, function(channel){

				var item = { id: channel.id, name: channel.name, user: channel.is_im };
				if(channel.is_im === true && !channel.user.is_bot) {
					item.user = true;
					item.presence = channel.user.presence;
				}
				if(currentChatId === channel.id){
					item.active = true;
				}
				else{
					if(channel.unread_count_display){
						item.unread = channel.unread_count_display;
						if(channel.is_im){ // K_TODO: This should also be triggered on channels if mentioned....
							item.notification = channel.unread_count_display;
						}
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
			<Sidemenu ref="sidemenu" data={{rows: channels}} {...this.props} />
		);
	}
});

module.exports = LocalSidemenu;
