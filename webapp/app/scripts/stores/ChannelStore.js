var Reflux = require('reflux');
var data = [];
var userStore = require('./UserStore');
var ChannelStore = Reflux.createStore({
	localStorage: "ChannelStore",
	sort: 'name',
	beforeSaveHandler: function(data, oldData){
		if(data.type === "direct" && data.user_id){
			var user = userStore.get(data.user_id);
			if(user)
				data.name = user.name;
		}
		return data;
	}
});

module.exports = ChannelStore;
