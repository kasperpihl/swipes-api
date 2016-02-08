var Reflux = require('reflux');
var moment = require('moment');
var TimeUtility = require('../utilities/time_util');
var ChatActions = require('../actions/ChatActions');
var ChannelStore = require('./ChannelStore');
var UserStore = require('./UserStore');
var BotStore = require('./BotStore');
var ChatStore = Reflux.createStore({
	listenables: [ChatActions],
	start: function() {


		var self = this;
		swipes.service("slack").request('rtm.start', function(res, err){
			var obj = res.data;
			if(err){
				return;
			}
			UserStore.batchLoad(obj.users, {flush:true});
			BotStore.batchLoad(obj.bots, {flush:true});
			
			ChannelStore.batchLoad(obj.channels, {flush:true});
			ChannelStore.batchLoad(obj.groups);
			ChannelStore.batchLoad(obj.ims);
			

			
			obj.self.me = true;
			UserStore.update(obj.self.id, obj.self);

			self.connectSocket(obj.url);

			if(swipes.info.workflow.settings.channelId){
				ChatActions.setChannel(swipes.info.workflow.settings.channelId)
			}

			ChatActions.updateBadge();

		});
	},

	connectSocket: function(url){
		if(!this.webSocket){
			this.webSocket = new WebSocket(url);
			this.webSocket.onopen = function(){
				console.log("slack socket", "open");
			}
			this.webSocket.onclose = function () {
				console.log("slack socket", "close");
			}
			this.webSocket.onmessage = function(msg){
				var data = JSON.parse(msg.data);
				this.onHandleMessage(data);
			}.bind(this);
			this.webSocket.onerror = function(){
				console.log('slack socket', 'error');
			}
		}
	},
	apiPrefixForChannel:function(channel){
		if(channel.is_im){
			return "im."
		}
		if(channel.is_group){
			return "groups.";
		}
		return "channels.";
	},
	onSetChannel: function(channelId){
		var channel = ChannelStore.get(channelId);
		if(channel){
			this.unset(['messages', 'sections']);
			this.set('showingUnread', channel.last_read, {trigger:false});
			swipes.navigation.setTitle(channel.name);
			this.set('channelId', channel.id);
			this.fetchChannel(channel);
		}
		
	},
	
	sortMessages: function(){

		var self = this;
		var sortedMessages = this.get('messages');
		var lastUser, lastGroup, lastDate;
		var length = sortedMessages.length;
		var me = UserStore.me();
		var groups = _.groupBy(sortedMessages, function(model, i){

			var date = new Date(parseInt(model.ts)*1000);
			var group = moment(date).startOf('day').unix();

			model.timeStr = TimeUtility.getTimeStr(date);
			model.isExtraMessage = false;
			var user;
			if(model.user){
				user = UserStore.get(model.user);
				if(user){
					model.userObj = user;
					if(user.id == lastUser && group == lastGroup){
						model.isExtraMessage = true;
					}
					if(user.id === me.id){
						model.isMyMessage = true;
					}
				}
				
			}
			else if(model.bot_id){
				var bot = BotStore.get(model.bot_id);
				if(bot){
					model.bot = bot;
				}
			}
			else{
				var bot = {};
				if(model.username){
					bot.name = model.username;
				}
				model.bot = bot;
			}
			model.isLastMessage = (i === length - 1);

			lastGroup = group;
			lastUser = user ? user.id : null;
			lastDate = date;
			return group;
		});

		sortedKeys = _.keys(groups).sort()
		var sortedSections = [];
		for(var i = 0 ; i < sortedKeys.length ; i++){
			var key = sortedKeys[i];

			schedule = new Date(parseInt(key)*1000);
			var title = TimeUtility.dayStringForDate(schedule);
			sortedSections.push({"title": title, "messages": groups[key] });
		}
		
		this.set("sections", sortedSections);

	},

	onMarkAsRead:function(ts){
		var channel = ChannelStore.get(this.get('channelId'));
		ts = ts || _.last(this.get('messages')).ts;
		if(!channel || ts === channel.last_read){
			return;
		}
		var prefix = this.apiPrefixForChannel(channel);
		swipes.service('slack').request(prefix + "mark", 
			{
				channel: channel.id,
				ts: ts
		})
		.then(function(){
		})
	},

	onClickLink:function(url){
		swipes.actions.openURL(url);
	},
	setMessages:function(messages){
		this.set('messages', messages, {trigger: false});
		this.sortMessages();
	},
	removeMessage:function(ts){
		var currentMessages = this.get('messages') || [];
		for(var i = 0 ; i < currentMessages.length ; i++){
			var msg = currentMessages[i];
			if(msg.ts === ts){
				currentMessages = currentMessages.splice(i, 1);
				break;
			}
		}
		this.update('messages', currentMessages, {trigger:false});
		this.sortMessages();
	},
	addMessage:function(message){
		var newMessages = this.get('messages') || [];
		var found = false;
		for(var i = 0 ; i < newMessages.length ; i++){
			var msg = newMessages[i];
			if(msg.ts === message.ts){
				found = true;
				newMessages[i] = message;
				break;
			}
		}
		if(!found){
			newMessages.push(message);
		}
		this.update('messages', newMessages, {trigger: false});
		this.sortMessages();
	},
	onHandleMessage:function(msg){
		
		if(msg.type === 'message'){
			var me = UserStore.me();
			if(msg.channel){
				var channel = channelStore.get(message.channel);

				var currMessages = this.get('messages') || [];
				var message = msg;
				if(msg.subtype === 'message_changed'){
					message = msg.message;
				}
				else if(msg.subtype === 'message_deleted'){
					return this.removeMessage(msg.deleted_ts);
				}
				channelStore.updateChannel(message.channel, channel.unread_count_display + 1);

				// If message is in the current channel we should handle the unread handler
				if(message && msg.channel === this.get('channelId')){

					// If the latest message is your own, channel should be unread
					if(message.user === UserStore.me().id){
						this.set('showingUnread', null, {trigger: false});
						this.set('showingIsRead', false, {trigger: false});
					}
					else{
						if(channel && !channel.showingUnread){
							this.set('showingUnread', channel.last_read, {trigger: false});
						}
					}

					this.addMessage(message);
				}
			}
		}
		else if(msg.type === 'channel_marked' || msg.type === 'im_marked' || msg.type === 'group_marked'){
			// If a user marks a channel as unread back in time. Make sure to update the unread line.
			if(msg.channel === this.get('channelId')){
				this.set('showingIsRead', true, {trigger: false});
				if(!this.get('showingUnread') || this.get('showingUnread') > msg.ts){
					this.set('showingUnread', msg.ts, {trigger:false});
					this.set('showingIsRead', false, {trigger:false});
				}
			}
			var updateObj = {};
			updateObj.unread_count_display = msg.unread_count_display;
			updateObj.last_read = msg.ts;
			
			channelStore.updateChannel(msg.channel, updateObj);			
		}
		console.log('slack socket handler', msg.type, msg);
	},
	onSendMessage: function(message, callback){
		var self = this;
		swipes.service('slack').request('chat.postMessage', {text: encodeURIComponent(message), channel: this.get('channelId'), as_user: true}, function(res, err){
			if(res.ok){
				self.onMarkAsRead(res.data.ts);
			}
			callback();
		});
	},
	onUpdateBadge: function(){
		// Update notification count - get total number from store
		var total = ChannelStore.getTotalNotificationCount();
		var badge = total ? total : "";
		swipes.actions.setBadge(badge);
	},
	fetchChannel: function(channel){
		var self = this;
		swipes.service('slack').request(this.apiPrefixForChannel(channel) + "history", {channel: channel.id }).then(function(res){
			self.setMessages(_.sortBy(res.data.messages, 'ts'));
		}).catch(function(error){
		});
	}
});

module.exports = ChatStore;