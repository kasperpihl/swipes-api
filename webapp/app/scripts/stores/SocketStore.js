var Reflux = require('reflux');
var socketActions = require('../actions/SocketActions');
var channelStore = require('../stores/ChannelStore');
var appStore = require('../stores/AppStore');
var userStore = require('../stores/UserStore');
var stateActions = require('../actions/StateActions');
var eventActions = require('../actions/EventActions');
var eventStore = require('../stores/EventStore');
var SocketStore = Reflux.createStore({
	listenables: [ socketActions ],
	onStart: function(){
		var self = this;

		swipes._client.callSwipesApi("rtm.start").then(function(res){
			if(res.ok){
				userStore.batchLoad(res.users, {flush:true});
				channelStore.batchLoad(res.channels,{flush:true, trigger: false, persist: false});
				channelStore.batchLoad(res.ims, {trigger: false});
				appStore.batchLoad(res.apps, {flush:true, trigger:false});
				self.connect(res.url);
				stateActions.changeStarted(true, res.self);
			}
		}).fail(function(err){
			console.log("rtm start err", err);
		})
	},
	connect: function(url){
		var self = this;
		self.set("status", "connecting");
		this.webSocket = io.connect(url, {
			query: 'token=' + swipes.getToken(),
			reconnectionDelay: 5000
		});
		this.webSocket.on('message', function(data){
			console.log("websocket", data);
			if(data.type)
				eventActions.fire("websocket_" + data.type, data);
		});
		this.webSocket.on('connect', function(){
			self.set("status", "online");
		});
		this.webSocket.on('connect_error', function(err){
			self.set("status", "offline");
		})
		this.webSocket.on('reconnect_attempt', function(number){
			self.set("status","connecting");
		});
		this.webSocket.on('disconnect', function () {
			self.set("status", "offline");
		});
	}

});

module.exports = SocketStore;
