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
		return swipes.currentApp().get({table: "messages", query: { filter:{channel_id: channel.id} } });
	}).then(function(messages){
		console.log("triple promise yeah", messages);
		return swipes.currentApp().save({table: "messages"}, {"text": "test"})
	}).then(function(){
		console.log("fourth promise")
		return swipes.currentApp().method("start")
	}).then(function(result){
		console.log("fifth promise", result);
	}).fail(function(error){
		console.log("promise failed", error);
	})
});