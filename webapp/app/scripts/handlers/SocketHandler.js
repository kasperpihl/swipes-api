var channelStore = require('../stores/ChannelStore');
var appStore = require('../stores/AppStore');
var userStore = require('../stores/UserStore');

var SocketHandler = {
	start: function(){
		var self = this;
		swipes._client.callSwipesApi("rtm.start").then(function(res){
			if(res.ok){
				channelStore.batchLoad(res.channels,{flush:true});
				appStore.batchLoad(res.apps, {flush:true});
				userStore.batchLoad(res.users, {flush:true});
				console.log(appStore.size());
				self.connect(res.url);
			}
		}).fail(function(err){
			console.log("rtm start err", err);
		})
	},
	connect: function(url){
		console.log("connecting websocket", swipes.getToken());
		this.webSocket = io.connect(url, {
			query: 'token=' + swipes.getToken()
		});
		this.webSocket.on('message', function(data) {
			console.log("message", data);
		});
	}
};

module.exports = SocketHandler;