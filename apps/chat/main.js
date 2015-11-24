$(function(){
	swipes.chat = {};
	swipes.chat.newMessage = new NewMessage();
	swipes.chat.chatList = new ChatList();

	swipes.app("core").get("users").then(function(users){
		swipes.chat.users = users;
		return swipes.app("core").get("channels", swipes.info.channelId);
	}).then(function(channel){
		swipes.chat.channel = channel;
		console.log("promise double works", channel);
	}).fail(function(error){
		console.log("promise failed", error);
	})
});