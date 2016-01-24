var Reflux = require('reflux');
var NotificationActions = require('../actions/NotificationActions');
var NotificationStore = Reflux.createStore({
	listenables: [NotificationActions],
	onSendNotification: function(text){
		var notifications = this.get('messages') || [];
		var id = Math.random().toString(36).substring(7);
		var notification = {
			id: id,
			message: text
		};
		notifications.push(notification);
		this.set('messages', notifications);
	},
	onPopNotification: function(){
		var notifications = this.get('messages') || [];
		notifications.shift();
		this.set('messages', notifications);
	}
});

module.exports = NotificationStore;