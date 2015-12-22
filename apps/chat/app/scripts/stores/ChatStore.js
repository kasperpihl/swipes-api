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
		swipes.currentApp().save({table:"messages"}, {"text": message, "user_id": swipes.info.userId});

		this.sortMessages();
	},
	sortMessages: function(){
		var self = this;
		var sortedMessages = _.sortBy(this.messages, 'ts');
		var lastUser, lastGroup, lastDate;
		var groups = _.groupBy(sortedMessages, function(model, i){
			var date = new Date(parseInt(model.ts)*1000);
			var group = moment(date).startOf('day').unix();

			model.text = model.text.replace(/(?:\r\n|\r|\n)/g, '<br>');
			model.timeStr = TimeUtility.getTimeStr(date);

			user = self.users[model.user_id];
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

		this.trigger(sortedSections);

	},
	getInitialState: function(){
		return this.sortedSections;
	},
	start: function() {
		this.messages = [];
		this.sortMessages();
		var self = this;
		// Hook up the sockets
		swipes.currentApp().on("messages", function(message){
			console.log("message in chat", message.data);
			message.data.data.isNewMessage = true;
			self.messages.push(message.data.data);
			self.sortMessages();
		});
		swipes._client.callSwipesApi('users.list',function(users){
			users = users.results;
			self.users = _.indexBy(users, 'id');
			swipes.currentApp().get({table: "messages", query: {order: "ts"}}, function(messages){
				self.messages = messages.results;
				self.sortMessages();
			});
		});
	}
});

module.exports = ChatStore;
