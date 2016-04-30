var Reflux = require('reflux');
var UserStore = require('./UserStore');
var BotStore = require('./BotStore');
var ChatActions = require('../actions/ChatActions');

var ChannelStore = Reflux.createStore({
	// Making sure that DM's get name set on the channel property
	sort: 'name',
	general: function(){
		return _.findWhere(this.getAll(), {is_general: true});
	},
	getActive: function(){
		return _.filter(this.getAll(), function(channel){
			if( channel.is_archived ||
				(channel.is_im && !channel.is_open) ||
				(channel.is_channel && !channel.is_member) ||
				(channel.is_group && !channel.is_open)){
				return false;
			}
			return true;
		})
	},
	updateChannel: function(channelId, data, options){
		this.update(channelId, data, options);
		//ChatActions.updateBadge();
	},
	getTotalNotificationCount:function(){
		var total = 0;
		_.each(this.getAll(), function(channel){
			if(channel.unread_count_display && channel.unread_count_display > 0){
				total += channel.unread_count_display;
			}
		});
		return total;
	},
	beforeSaveHandler: function(newObj, oldObj){
		if((newObj.is_channel || newObj.is_group)){
			if(newObj.is_archived){
				return null;
			}
		}
		if(!newObj.name && newObj.user){
			var user = UserStore.get(newObj.user);
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
