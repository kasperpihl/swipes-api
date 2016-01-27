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
		channel.showingUnread = channel.last_read;
		this.set('channel', channel);
		this.fetchChannel(channel);
	},
	
	sortMessages: function(){

		var lastRead = this.get('channel').last_read;
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

	onMarkAsRead:function(ts, force){
		var channel = this.get('channel');
		ts = ts || _.last(this.get('messages')).ts;
		if(!force && ts === channel.last_read){
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
	
	clearOldLastRead: function(){
		if(this){
			this.update('channel', {old_last_read: null});
		}
	},
	onClickLink:function(url){
		swipes.actions.openURL(url);
	},
	setMessages:function(messages){
		this.set('messages', messages, {trigger: false});
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
			var updateObj = {};
			if(message.user === UserStore.me().id){
				updateObj.showingUnread = null;
				updateObj.showingIsRead = false;
			}
			else{
				updateObj.unread_count_display = this.get('channel').unread_count_display + 1;
				if(!this.get('channel').showingUnread){
					updateObj.showingUnread = this.get('channel').last_read;
				}
			}
			this.update('channel', updateObj, {trigger: false});
			newMessages.push(message);
		}
		this.update('messages', newMessages, {trigger: false});
		this.sortMessages();
	},
	onHandleMessage:function(msg){
		
		if(msg.type === 'message'){
			var me = UserStore.me();
			if(msg.channel && msg.channel === this.get('channel').id){
				var currMessages = this.get('messages') || [];
				var message = msg;
				if(msg.subtype === 'message_changed'){
					message = msg.message;
				}
				if(message){
					this.addMessage(message);	
				}
			}
		}
		else if(msg.type === 'channel_marked' || msg.type === 'im_marked' || msg.type === 'group_marked'){
			if(msg.channel && msg.channel === this.get('channel').id){
				updateObj = {};
				updateObj.unread_count_display = msg.unread_count_display;
				updateObj.last_read = msg.ts;
				updateObj.showingIsRead = true;
				// If a user marks a channel as unread back in time. Make sure to update the unread line.
				if(!this.get('channel').showingUnread || this.get('channel').showingUnread > msg.ts){
					updateObj.showingUnread = msg.ts;
					updateObj.showingIsRead = false;
				}
				
				this.update('channel', updateObj);
			}
		}
		console.log('slack socket handler', msg.type, msg);
	},
	onSendMessage: function(message, callback){
		var self = this;
		swipes.service('slack').request('chat.postMessage', {text: encodeURIComponent(message), channel: this.get('channel').id, as_user: true}, function(res, err){
			if(res.ok){
				self.onMarkAsRead(res.data.ts);
			}
			callback();
		});
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