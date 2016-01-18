var Reflux = require('reflux');

var ChannelActions = require('../actions/ChannelActions');
var ChannelStore = require('./ChannelStore');
var UserStore = require('./UserStore');
var BotStore = require('./BotStore');
var ChatStore = Reflux.createStore({
	start: function() {
		var self = this;
		swipes.service("slack").request('rtm.start', function(res, err){
			var obj = res.data;
			console.log('rtm', obj, err);
			UserStore.batchLoad(obj.users, {flush:true});
			BotStore.batchLoad(obj.bots, {flush:true});
			for( var i = 0 ; i < obj.channels.length ; i++ ){
				var channel = obj.channels[i];
				if(channel.name === 'dev-report'){
					ChannelStore.setChannel(channel);
				}
			}
			
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
			var data = JSON.parse(msg.data);
			ChannelActions.handleMessage(data);
		}
		this.webSocket.onerror = function(){
			console.log('slack socket', 'error');
		}
	}
});

module.exports = ChatStore;
