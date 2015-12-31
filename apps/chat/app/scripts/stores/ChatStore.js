var Reflux = require('reflux');
var _ = require('underscore');
var moment = require('moment');
var chatActions = require('../actions/ChatActions');
var TimeUtility = require('../utilities/time_util');

var ChatStore = Reflux.createStore({
	listenables: [chatActions],
	sortedSections: [],
	users: {},
	onSendMessage: function(message){
		console.log("sending message", message);
		var data = {"text": message, "user_id": swipes.info.userId};
		if(this.get('thread'))
			data.thread = this.get('thread');
		swipes.currentApp().save({table:"messages"}, data);
		//this.sortMessages();
	},
	onUnsetThread: function(){
		this.unset('thread');
		this.loadMessages();
	},
	onSetThread: function(thread){
		console.log('setting thread', thread);
		this.set("thread", thread);
		this.loadMessages();
	},
	sortMessages: function(){
		var self = this;
		var sortedMessages = _.sortBy(this.get('messages'), 'ts');
		var lastUser, lastGroup, lastDate;
		var groups = _.groupBy(sortedMessages, function(model, i){
			var date = new Date(parseInt(model.ts)*1000);
			var group = moment(date).startOf('day').unix();

			model.text = model.text.replace(/(?:\r\n|\r|\n)/g, '<br>');
			model.timeStr = TimeUtility.getTimeStr(date);

			user = self.get('users')[model.user_id];
			if(user && user.id == lastUser && group == lastGroup){
				model.isExtraMessage = true;
			}
			else{
				model.isExtraMessage = false;
			}
			if(!user){
				user = { name: "unknown" };
			}

			model.user = user;
			if(!model.user.profile){
				model.user.profile = {};
				model.user.profile.profile_image = "https://unsplash.it/40/?random"
			}

			lastGroup = group;
			lastUser = user.id;
			lastDate = date;
			return group;
		});
		sortedKeys = _.keys(groups).sort()
		var sortedSections = [];
		for(var i = 0 ; i < sortedKeys.length ; i++){
			var key = sortedKeys[i];
			for(var j = 0 ; j < groups[key].length ; j++){
				//console.log(groups[key][j]);
			}
			schedule = new Date(parseInt(key)*1000);
			var title = TimeUtility.dayStringForDate(schedule);
			sortedSections.push({"title": title, "messages": _.sortBy(groups[key], 'ts')});
		}
		this.sortedSections = sortedSections;

		this.set("sections", sortedSections);

	},
	loadMessages: function(options){
		this.set('messages', [], {trigger:false});
		this.sortMessages();
		options = (typeof options === 'object') ? options : {};

		var self = this;
		var data = {table: "messages", query: {limit:50, order: "-ts"}};
		if(options.skip){
			data.query.skip = options.skip;
		}
		if(this.get('thread')){
			var thread = this.get('thread');
			data.query.filter = {thread: {appId: thread.appId, id: thread.id}};
		}

		swipes.currentApp().get(data, function(messages){
			self.set("messages", messages.results, {trigger:false});
			self.sortMessages();
		});
	},
	start: function() {
		this.set('messages', [], {trigger:false});
		//this.sortMessages();
		var self = this;
		// Hook up the sockets
		swipes.currentApp().on("messages", function(message){
			console.log("message in chat", message.data);
			message.data.data.isNewMessage = true;
			self.get('messages').push(message.data.data);
			self.sortMessages();
		});
		swipes._client.callSwipesApi('users.list',function(users){
			self.set("users",_.indexBy(users.results, 'id'), {trigger:false});
			self.loadMessages();
		});
	}
});

module.exports = ChatStore;
