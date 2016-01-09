var Reflux = require('reflux');
var _ = require('underscore');
var channelActions = require('../actions/ChannelActions');
var TimeUtility = require('../utilities/time_util');
var userStore = require('./UserStore');
var ChannelStore = Reflux.createStore({
	listenables: [channelActions],
	// Making sure that DM's get name set on the channel property
	apiPrefixForChannel:function(channel){
		if(channel.is_im){
			return "im."
		}
		if(channel.is_group){
			return "groups.";
		}
		return "channels.";
	},
	fetchChannel: function(channel){
		var self = this;
		swipes.service('slack').request(this.apiPrefixForChannel(channel) + "history", {channel: channel.id, inclusive: 1, count: channel.unread_count+3 }).then(function(res){
			console.log(res);
			self.update(channel.id, {has_fetched:true, fetching: false, messages: res.messages});
		}).catch(function(error){
			console.log('ee', error);
		});
	},
	beforeSaveHandler: function(newObj, oldObj){
		if(newObj && !oldObj && !newObj.is_archived){
			if(!newObj.unread_count){
				newObj.has_fetched = true;
				
			}
			else{
				newObj.fetching = true;
				newObj.messageQueue = [];
				this.fetchChannel(newObj);
			}
			newObj.messages = [newObj.latest];
		}
		if(!newObj.name && newObj.is_im){
			var user = userStore.get(newObj.user);
			if(user && user.name){
				newObj.name = user.name
			}
		}
		return newObj;
	}
});

module.exports = ChannelStore;