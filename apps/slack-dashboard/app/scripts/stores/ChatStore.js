var Reflux = require('reflux');
var _ = require('underscore');
var chatActions = require('../actions/ChatActions');
var TimeUtility = require('../utilities/time_util');
var ChannelStore = require('./ChannelStore');
var UserStore = require('./UserStore');

var ChatStore = Reflux.createStore({
	listenables: [chatActions],
	start: function() {
		var self = this;
		swipes.service("slack").request('rtm.start').then(function(obj){
			UserStore.batchLoad(obj.users, {flush:true})
			ChannelStore.batchLoad(obj.channels, {flush:true, trigger:false});
			ChannelStore.batchLoad(obj.ims, {trigger:false});
			ChannelStore.batchLoad(obj.groups, {trigger:true});
			
			obj.self.me = true;
			UserStore.update(obj.self.id, obj.self);
			console.log('Channels in a store', UserStore.getAll(), ChannelStore.getAll());
			self.connect(obj.url);
		});
	},
	connect: function(url){
		this.webSocket = new WebSocket(url);
		this.webSocket.onopen = function(){
			console.log("status", "open");
		}
		this.webSocket.onclose = function () {
			console.log("status", "close");
		}
		this.webSocket.onmessage = function(msg){
			console.log("websocket", JSON.parse(msg.data));
		}
		this.webSocket.onerror = function(){
			console.log('status', 'error');
		}
	}
});

module.exports = ChatStore;
