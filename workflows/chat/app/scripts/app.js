require('reflux-model-extension');
var Router = require('./router');

var chatStore = require('./stores/ChatStore');

Router.start();

swipes.onReady(function(){
	chatStore.start();
})
	/*window.webSocket = io.connect("http://localhost:5000", {
		query: 'token=' + token
	});
	webSocket.on('message', function(data) {
		console.log(data);
		if(data && data.type === "chat_messages"){
			
		}
	});
	swipes.api.request("channels.list",function(res, error){
		if(res && res.ok){
			for(var i = 0 ; i < res.results.length ; i++ ){
				var channel = res.results[i];
				if(channel.is_general){
					swipes.info.channelId = channel.id;
					swipes.setDefaultScope(channel.id);
					break;
				}
			}
			swipes.api.request("users.me", function(res, error){
				if(res && res.ok){
					swipes.info.userId = res.user.id;
					chatStore.start();
					//
				}
			});
		}
	})*/
