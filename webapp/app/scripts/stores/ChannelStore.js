var Reflux = require('reflux');
var data = [];
var userStore = require('./UserStore');
var ChannelStore = Reflux.createStore({
	localStorage: "ChannelStore",
	sort: 'name',
	// Using the beforeSaveHandler to set the username as name if the channel is a direct message.
	beforeSaveHandler: function(data, oldData){
		if(data.type === "direct" && data.user_id){
			var user = userStore.get(data.user_id);
			if(user)
				data.name = user.name;
		}
		return data;
	},
	search:function(string, options){
		var results = [];
		this.each(function(channel){
			var searchResult = {
				appId: "ACHANNEL",
				text: channel.name,
				id: channel.id
			};
			if(channel.type != 'direct' && channel.name.toLowerCase().startsWith(string.toLowerCase())){
				results.push(searchResult);
			}
		})
		return {
			appId: "ACHANNEL",
			name: "Channels",
			results: results
		};
	}
});

module.exports = ChannelStore;
