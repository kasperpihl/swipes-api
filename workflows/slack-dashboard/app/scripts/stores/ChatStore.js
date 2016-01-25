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
		this.set('channel', channel);
		this.fetchChannel(channel);
	},
	setMessages:function(messages){
		this.set('messages', messages, {trigger: false});
		this.sortMessages();
	},
	addMessage:function(message){
		var newMessages = this.get('messages') || [];
		newMessages.push(message);
		this.update('messages', newMessages);
	},
	editMessage: function(message){

	},
	sortMessages: function(){
		
		var self = this;
		var sortedMessages = _.sortBy(this.get('messages'), 'ts');
		var lastUser, lastGroup, lastDate;
		var groups = _.groupBy(sortedMessages, function(model, i){

			var date = new Date(parseInt(model.ts)*1000);
			var group = moment(date).startOf('day').unix();

			model.timeStr = TimeUtility.getTimeStr(date);
			model.isExtraMessage = false;
			var user;
			if(model.user){
				user = UserStore.get(model.user);
				if(user){
					model.user = user;
				}
				if(user && user.id == lastUser && group == lastGroup){
					model.isExtraMessage = true;
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
			var me = UserStore.me();
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
		console.log('slack socket handler', msg.type, msg);
	},
	onSendMessage: function(channel, message){
		var self = this;
		swipes.service('slack').request('chat.postMessage', {text: encodeURIComponent(message), channel: channel.id, as_user: true}, function(res, err){
			if(res.ok){
			}
		});
	},
	fetchChannel: function(channel){
		var self = this;
		swipes.service('slack').request(this.apiPrefixForChannel(channel) + "history", {channel: channel.id }).then(function(res){
			self.setMessages(res.data.messages);
		}).catch(function(error){
		});
	}
});

module.exports = ChatStore;
