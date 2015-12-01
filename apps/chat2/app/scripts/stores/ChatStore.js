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
		var threeRandom = ('000' + Math.random().toFixed(3)*1000).substr(-3);
		var ts = parseFloat(new Date().getTime() / 1000).toFixed(3) + threeRandom;

		this.sortMessages();
	},
	sortMessages: function(){
		var self = this;
		var groups = _.groupBy(this.messages, function(model, i){
			var defUser = {
				name: "unknown"	
			};
			var user = self.users[model.user_id];
			if(user){
				model.user = user;
			}
			else model.user = defUser;
			var date = new Date(parseInt(model.ts)*1000);
			return moment(date).startOf('day').unix();
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
			sortedSections.push({"title": title, "messages": groups[key]});
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