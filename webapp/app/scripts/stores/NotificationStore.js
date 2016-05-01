var Reflux = require('reflux');
var notificationActions = require('../actions/NotificationActions');
var bridgeStore = require('./BridgeStore');

var NotificationStore = Reflux.createStore({
	listenables: [ notificationActions ],
	localStorage: "NotificationStore",
	persistOnly: [ "notificationState"],
	init: function(){
		this.manualLoadData();
		this.a1 = new Audio('https://s3.amazonaws.com/cdn.swipesapp.com/default.mp3');
		this.a2 = new Audio('https://s3.amazonaws.com/cdn.swipesapp.com/default.mp3');
		this.set("history", []);
		if(this.get('notificationState') === 'undefined') {
			this.set('notificationState', true);
		}
	},
	onSetNotifications: function() {
		var notif = this.get('notificationState');
		this.set('notificationState', !notif)
	},
	onSend: function(options){
		if(this.isDuplicate(options)){
			return;
		}
		if(bridgeStore.bridge){
			bridgeStore.callBridge('notify', options);
		}
		else{
			this.playSound();
		}
	},
	isDuplicate:function(options){
		var title = options.title || "";
		var message = options.message || "";
		var history = this.get('history');
		var now = new Date().getTime();
		var sliceFrom;
		var isDuplicate = false;
		if(history.length){
			for(var i = history.length-1 ; i >= 0 ; i--){
				var object = history[i];
				if(object.time > (now - 3000)){
					if(object.title === title && object.message === message){
						isDuplicate = true;
						break;
					}
				}
				else if(!sliceFrom){
					sliceFrom = true;
					break;
				}

			}
		}
		if(sliceFrom){
			this.set('history', history.slice(sliceFrom));
		}
		else if(!isDuplicate){
			history.push({title: title, message: message, time: now});
			this.set('history', history);
		}
		return isDuplicate;
	},
	playSound: function(){
		this.a1.play();
		setTimeout(function() {
			this.a2.play();
		}.bind(this), 100)
	}
});

module.exports = NotificationStore;
