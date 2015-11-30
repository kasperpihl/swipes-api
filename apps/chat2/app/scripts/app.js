var Router = require('./router');
var chatStore = require('./stores/ChatStore');
Router.start();

if(!swipes.info.userId){
	window.webSocket = io.connect("http://localhost:5000", {
		query: 'token=' + token
	});
	webSocket.on('message', function(data) {
		console.log(data);
	});
	swipes._client.callSwipesApi("channels.list",function(res, error){
		if(res && res.ok){
			for(var i = 0 ; i < res.results.length ; i++ ){
				var channel = res.results[i];
				if(channel.is_general){
					swipes.info.channelId = channel.id;
					swipes.setDefaultScope(channel.id);
					break;
				}
			}
			swipes._client.callSwipesApi("users.me", function(res, error){
				if(res && res.ok){
					swipes.info.userId = res.user.id;
					console.log(swipes.info);
					chatStore.start();
					//
				}
			});
		}
	})
	
}
else{
	chatStore.start();
}