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
	onMarkAsRead:function(channel){
		var prefix = this.apiPrefixForChannel(channel);
		console.log('marking', channel.messages[0].ts);
		swipes.service('slack').request(prefix + "mark", 
			{
				channel: channel.id, 
				ts: channel.messages[0].ts
		})
		.then(function(){
		})
	},
	onHandleMessage:function(msg){
		
		if(msg.type === 'message'){
			var me = userStore.me();
			var channel = this.get(msg.channel);
			if(channel){
				
				updateObj = {};
				var curUnread = channel.unread_count;
				if(me && me.id !== msg.user)
					updateObj.unread_count = updateObj.unread_count_display = curUnread + 1;

				var currMessages = channel.messages || [];
				updateObj.messages = [msg].concat(currMessages);
				this.update(channel.id, updateObj);
			}
		}
		else if(msg.type === 'channel_marked' || msg.type === 'im_marked' || msg.type === 'group_marked'){
			var channel = this.get(msg.channel);
			if(channel){
				updateObj = {};
				updateObj.unread_count = msg.unread_count;
				updateObj.unread_count_display = msg.unread_count_display;
				updateObj.last_read = msg.ts;
				var currMessages = channel.messages || [];
				if(currMessages.length > 0)
					updateObj.messages = [currMessages[0]];
				this.update(channel.id, updateObj);
			}
		}
		console.log('store handler', msg);
	},
	fetchChannel: function(channel){
		var self = this;
		swipes.service('slack').request(this.apiPrefixForChannel(channel) + "history", {channel: channel.id, inclusive: 1, oldest: channel.last_read }).then(function(res){
			self.update(channel.id, {has_fetched:true, fetching: false, messages: res.messages});
		}).catch(function(error){
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