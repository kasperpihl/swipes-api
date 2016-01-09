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
			self.connect(obj.url);
		});
	},
	connect: function(url){
		this.webSocket = new WebSocket(url);
		this.webSocket.onopen = function(){
			console.log("slack socket", "open");
		}
		this.webSocket.onclose = function () {
			console.log("slack socket", "close");
		}
		this.webSocket.onmessage = function(msg){
			console.log("slack socket", JSON.parse(msg.data));
		}
		this.webSocket.onerror = function(){
			console.log('slack socket', 'error');
		}
	}
});

module.exports = ChatStore;
