var Reflux = require('reflux');
var moment = require('moment');
var TimeUtility = require('../utilities/time_util');
var ChatActions = require('../actions/ChatActions');
var ChannelStore = require('./ChannelStore');
var UserStore = require('./UserStore');
var BotStore = require('./BotStore');

var typingUsers = {};

var ChatStore = Reflux.createStore({
	listenables: [ChatActions],
	start: function() {

		if(this.isStarting){
			return;
		}
		if(!this.timer){
			this.timer = setInterval(this.onCheckSocket.bind(this), 6000);
		}
		this.isStarting = true;

		// When window onload, close websocket and make sure not to try to reopen. (reset onclose)
		window.onbeforeunload = function(){
			if(this.webSocket){
				this.webSocket.onclose = function(){};
			}
			this.closeWebSocket.bind(this);
		}.bind(this)
		var self = this;
		swipes.service("slack").request('rtm.start', function(res, err){
			self.isStarting = false;
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

			var channelId = swipes.info.workflow.settings.channelId;
			if(!channelId){
				channelId = ChannelStore.general().id;
			}

			ChatActions.setChannel(channelId);
			//ChatActions.updateBadge();

		});
	},
	connectSocket: function(url){

		if(!this.webSocket){
			this.webSocket = new WebSocket(url);
			this.webSocket.onopen = function(){
				console.log("slack socket", "open");
			}.bind(this);
			this.webSocket.onclose = function () {
				console.log("slack socket", "close", "now let's reopen");
				this.webSocket = null;
				this.start();
			}.bind(this);
			this.webSocket.onmessage = function(msg){
				var data = JSON.parse(msg.data);
				this.onHandleMessage(data);
			}.bind(this);

			this.webSocket.onerror = function(){
				console.log('slack socket', 'error');
			}
		}
	},
	closeWebSocket:function(){
		// If the websocket exist and is in state OPEN or CONNECTING
		if( this.webSocket && this.webSocket.readyState <= 1 ){
			console.log('closing the socket manually!');
			this.webSocket.close();
			this.webSocket = null;
		}
	},
	onCheckSocket:function(){
		// Don't double ping.
		if(this.isPinging){
			return;
		}
		// If no websocket - run rtm.start again.
		if(!this.webSocket){
			return this.start();
		}
		// State is CONNECTING or CLOSING - Don't interfere
		if(this.webSocket.readyState === 0 || this.webSocket.readyState === 2){
			return;
		}
		// If state is CLOSED, remove webSocket variable and run rtm.start again.
		if(this.webSocket.readyState === 3){
			this.webSocket = null;
			return this.start();
		}
		// Send a ping to the socket, expect return.
		this.webSocket.send(JSON.stringify({'id':'1234', 'type': 'ping'}));
		this.isPinging = true;
		var ping = new Date().getTime();
		setTimeout(function(){
			this.isPinging = false;
			if(!this.lastPong || this.lastPong < ping){
				this.closeWebSocket();
			}
		}.bind(this), 4000);
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
			swipes.sendEvent('navigation.setTitle', {title:channel.name});
			this.set('channelId', channel.id);
			this.fetchChannel(channel);
		}

	},
	sortMessages: function(messages){
		var self = this;
		var sortedMessages = messages || this.get('messages');
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

		var sortedKeys = _.keys(groups).sort();
		var sortedSections = [];
		for(var i = 0 ; i < sortedKeys.length ; i++){
			var key = sortedKeys[i];

			var schedule = new Date(parseInt(key)*1000);
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

		currentMessages = currentMessages.filter(
			function (el) {
				return el.ts !== ts
			}
		)

		this.update('messages', currentMessages, {trigger: false});
		this.sortMessages(currentMessages);
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
		if(msg.type === 'pong'){
			this.lastPong = new Date().getTime();
		}
		if(msg.type === 'message'){
			var me = UserStore.me();
			if(msg.channel){
				//console.log('msg', msg);
				var channel = ChannelStore.get(msg.channel);
				var me = UserStore.me();

				var currMessages = this.get('messages') || [];
				var message = msg;
				if(msg.subtype === 'message_changed'){
					message = msg.message;
				}
				else if(msg.subtype === 'message_deleted'){
					return this.removeMessage(msg.deleted_ts);
				}

				// If message is from someone else, and is not hidden
				if(message.user !== me.id && !msg.hidden){
					ChannelStore.updateChannel(message.channel, {'unread_count_display': channel.unread_count_display + 1 });
					// K_TODO: Test if msg.text
					var text = msg.text;
					if(channel.is_im){
						swipes.notifications.send({title: channel.name, message: text})
					}
				}

				// If message is in the current channel we should handle the unread handler
				if(message && msg.channel === this.get('channelId')){

					// If the latest message is your own, channel should be unread
					if(message.user === me.id){
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
		else if(msg.type === 'presence_change'){
			UserStore.update(msg.user, {presence: msg.presence});
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

			ChannelStore.updateChannel(msg.channel, updateObj);
		}

		if (msg.type === 'user_typing' && msg.channel === this.get('channelId')) {
			this.userTyping(msg);
		}

		// console.log('slack socket handler', msg.type, msg);
	},
	userTyping: function (data) {
		var self = this;

		if (typingUsers[data.user]) {
			clearTimeout(typingUsers[data.user]);
		}

		var timeout = setTimeout(function() {
			delete typingUsers[data.user];
			self.userTypingLabel();
		}, 5000);

		typingUsers[data.user] = timeout;
		this.userTypingLabel();
	},
	userTypingLabel: function() {
		var userIds = Object.keys(typingUsers);
		var users = [];
		var content = '';

		userIds.forEach(function(userId) {
			users.push(UserStore.get(userId).name);
		});

		content = users.join(', ');

		if (users.length > 1) {
			content += ' are typing..';
			this.set('typing', content);
		} else if (users.length === 1) {
			content += ' is typing..'
			this.set('typing', content);
		} else {
			content = '';
			this.set('typing', false);
		}
	},
	onUploadFile: function(file, callback){
		var token = swipes.info.workflow.slackToken;
		var formData = new FormData();
		formData.append("token", token);
		formData.append("channels", this.get('channelId'));
		formData.append("filename", file.name);
		formData.append("title", file.name);
		formData.append("file", file);
		this.__tempSlackRequest('files.upload', {}, function(result, error){
			callback(result, error);
		}.bind(this), formData);
	},
	onUploadClipboard: function(blob, message, callback) {
		var token = swipes.info.workflow.slackToken;
		var formData = new FormData();
		var date = moment().format('YYYY-MM-DD, h:mm A');
		var imageTitle;

		if (!message) {
			imageTitle = 'Pasted image at' + date;
		} else {
			imageTitle = message;
		}

		formData.append("token", token);
		formData.append("channels", this.get('channelId'));
		formData.append("filename", 'Pasted image at ' + date);
		formData.append("title", imageTitle);
		formData.append("file", blob);
		this.__tempSlackRequest('files.upload', {}, function(result, error){
			callback(result, error);
		}.bind(this), formData);
	},
	onSendMessage: function(message, callback){
		var self = this;
		swipes.service('slack').request('chat.postMessage', {text: encodeURIComponent(message), channel: this.get('channelId'), as_user: true, link_names: 1}, function(res, err){
			if(res.ok){
				swipes.sendEvent('analytics.action', {name: "Send message"});
				self.onMarkAsRead(res.data.ts);
			}
			callback();
		});
	},
	onDeleteMessage: function(timestamp){
		var newMessages = this.get('messages') || [];

		this.removeMessage(timestamp);

		swipes.service('slack').request('chat.delete', {token: swipes.info.workflow.slackToken, ts: timestamp, channel: this.get('channelId')}, function(res, err){
			if (err) {
				console.log(err);
			}
		});
	},
	onEditMessage: function(message, timestamp) {
		var that = this;
		swipes.modal.edit('Edit Message', message, function(res) {
			if (res) {
				var newText = res;
				swipes.service('slack').request('chat.update', {token: swipes.info.workflow.slackToken, ts: timestamp, channel: that.get('channelId'), text: encodeURIComponent(res)}, function(res, err) {
					if (err) {
						console.log(err);
					}
				})
			}
		})
	},
	onOpenImage: function(src, title, url) {
		swipes.modal.lightbox('', title, url);

		swipes.service('slack').stream('file', {url: src})
		.then(function (arraybuffer) {
			var blob = new Blob([arraybuffer], {type: "application/octet-stream"});
			var blobSrc = URL.createObjectURL(blob);

			swipes.modal.lightbox(blobSrc, title, url);
		})
		.catch(function (error) {
			console.log(error);
		})
	},
	onLoadPrivateImage: function (domElement, src) {
		swipes.service('slack').stream('file', {url: src})
		.then(function (arraybuffer) {
			var blob = new Blob([arraybuffer], {type: "application/octet-stream"});
			var url = URL.createObjectURL(blob);

			domElement.src = url;
		})
		.catch(function (error) {
			console.log(error);
		})
	},
	onUpdateBadge: function(){
		// Update notification count - get total number from store
		var total = ChannelStore.getTotalNotificationCount();
		var badge = total ? total : "";
		swipes.sendEvent('navigation.setBadge', {badge: badge});
	},
	fetchChannel: function(channel){
		var self = this;
		swipes.service('slack').request(this.apiPrefixForChannel(channel) + "history", {channel: channel.id }).then(function(res){
			self.setMessages(_.sortBy(res.data.messages, 'ts'));
		}).catch(function(error){
			console.log(error);
		});
	},
	/* T_INFO // We should replace these once we can upload directly through our service
	// Though, the request might come in handy for how to send the request since they use formData for files.
	*/

	__tempSlackRequest:function(command, options, callback, formData){
		var url = 'https://slack.com/api/' + command;
		var token = swipes.info.workflow.slackToken;
		options = options || {};
		options.token = swipes
		var settings = {
			url : url,
			type: "POST",
			success: function(res){
				console.log('res slack upload', res);
				callback(true);
			},
			error: function(err){
				console.log('err slack upload', err);
				callback(false, err);
			},
			crossDomain: true,
			context: this,
			data: options,
			processData: true
		};
		if(formData){
			settings.data = formData;
			settings.processData = false;
			settings.contentType = false;

		}
		$.ajax(settings);
	},
	onSendTypingEvent: function() {
		var currentChannel = ChannelStore.get(this.get('channelId'));

		if(this.isPinging){
			return;
		}
		if(!this.webSocket){
			return this.start();
		}
		if(this.webSocket.readyState === 0 || this.webSocket.readyState === 2){
			return;
		}
		if(this.webSocket.readyState === 3){
			this.webSocket = null;
			return this.start();
		}
		console.log('we are in store, we made it')
		this.webSocket.send(JSON.stringify({'id': '1', 'type': 'typing', 'channel': currentChannel.id}));

	}
});

module.exports = ChatStore;
