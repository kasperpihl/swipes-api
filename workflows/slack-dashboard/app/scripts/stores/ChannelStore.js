var Reflux = require('reflux');
var UserStore = require('./UserStore');
var BotStore = require('./BotStore');

var ChannelStore = Reflux.createStore({
	// Making sure that DM's get name set on the channel property
	sort: 'name',
	beforeSaveHandler: function(newObj, oldObj){
		if((newObj.is_channel || newObj.is_group)){
			if(newObj.is_archived){
				return null;
			}
		}
		if(!newObj.name && newObj.user){
			var user = UserStore.get(newObj.user);
			console.log(user);
			if(user){
				if(user.deleted){
					return null;
				}
				newObj.name = user.name;
				newObj.user = user;
			}
		}
		return newObj;
	}
});

module.exports = ChannelStore;