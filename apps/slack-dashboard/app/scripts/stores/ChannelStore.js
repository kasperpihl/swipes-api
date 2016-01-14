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
	onMarkAsRead:function(channel, ts){
		ts = ts || _.last(channel.messages).ts;
		var prefix = this.apiPrefixForChannel(channel);
		swipes.service('slack').request(prefix + "mark", 
			{
				channel: channel.id, 
				ts: ts
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
				var curUnread = channel.unread_count_display;
				if(me && me.id !== msg.user){
					updateObj.unread_count_display = curUnread + 1;
				}
				var currMessages = channel.messages || [];
				var newMessages = currMessages.concat([msg]);
				updateObj.messages = newMessages;

				this.update(channel.id, updateObj);
			}
		}
		else if(msg.type === 'channel_marked' || msg.type === 'im_marked' || msg.type === 'group_marked'){
			var channel = this.get(msg.channel);
			if(channel){
				updateObj = {};
				updateObj.unread_count_display = msg.unread_count_display;
				updateObj.last_read = msg.ts;
				var currMessages = channel.messages || [];
				if(currMessages.length > 0)
					updateObj.messages = [_.last(currMessages)];
				this.update(channel.id, updateObj);
			}
		}
		console.log('store handler', msg.type, msg);
	},
	onSendMessage: function(channel, message){
		var self = this;
		swipes.service('slack').request('chat.postMessage', {text: encodeURIComponent(message), channel: channel.id, as_user: true}, function(res, err){
			if(res.ok){
				//channelActions.markAsRead(channel, res.ts);
			}
		});
	},
	fetchChannel: function(channel){
		var self = this;
		swipes.service('slack').request(this.apiPrefixForChannel(channel) + "history", {channel: channel.id, inclusive: 1, oldest: channel.last_read }).then(function(res){
			self.update(channel.id, {has_fetched:true, fetching: false, messages: res.messages.reverse()});
		}).catch(function(error){
		});
	},
	beforeSaveHandler: function(newObj, oldObj){
		if(newObj && !oldObj && !newObj.is_archived){
			if(!newObj.unread_count_display){
				newObj.has_fetched = true;
			}
			else{
				newObj.fetching = true;
				newObj.messageQueue = [];
				//this.fetchChannel(newObj);
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