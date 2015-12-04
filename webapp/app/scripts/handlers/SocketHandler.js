var channelStore = require('../stores/ChannelStore');
var appStore = require('../stores/AppStore');
var userStore = require('../stores/UserStore');
var stateActions = require('../actions/StateActions');

var SocketHandler = {
	start: function(){
		var self = this;
		swipes._client.callSwipesApi("rtm.start").then(function(res){
			if(res.ok){
				channelStore.batchLoad(res.channels,{flush:true, trigger: false, persist: false});
				channelStore.batchLoad(res.ims, {trigger: false});
				appStore.batchLoad(res.apps, {flush:true, trigger:false});
				userStore.batchLoad(res.users, {flush:true});
				console.log(appStore.size());
				self.connect(res.url);
				stateActions.changeStarted(true);
			}
		}).fail(function(err){
			console.log("rtm start err", err);
		})
	},
	connect: function(url){
		console.log("connecting websocket", swipes.getToken());
		stateActions.changeConnection("connecting");
		this.webSocket = io.connect(url, {
			query: 'token=' + swipes.getToken(),
			reconnectionDelay: 5000
		});
		this.webSocket.on('connect', function(){
			stateActions.changeConnection("online");
		});
		this.webSocket.on('connect_error', function(err){
			stateActions.changeConnection("offline");
		})
		this.webSocket.on('reconnect_attempt', function(number){
			stateActions.changeConnection("connecting");
		});
		this.webSocket.on('disconnect', function () {
			stateActions.changeConnection("offline");
		});
	}
};

module.exports = SocketHandler;