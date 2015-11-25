$(function(){

	swipes.chat = {};
	swipes.chat.newMessage = new NewMessage();
	swipes.chat.chatList = new ChatList();

	swipes.app("core").get("users").then(function(users){
		swipes.chat.users = users;
		return swipes.app("core").get("channels", swipes.info.channelId);
	}).then(function(channel){
		swipes.chat.channel = channel;
		return swipes.currentApp().get({table: "messages", query: { filter:{channel_id: channel.id} } });
	}).then(function(messages){
		return swipes.currentApp().save({table: "messages"}, {"text": "test", "scope": "UAD4XVDQJ"})
	}).then(function(){
		return swipes.currentApp().method("start", {"test": true})
	}).then(function(result){
	}).fail(function(error){
		console.log("promise failed", error);
	})
});