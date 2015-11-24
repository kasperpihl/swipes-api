$(function(){
	swipes.chat = {};
	swipes.chat.newMessage = new NewMessage();
	swipes.chat.chatList = new ChatList();

	swipes.app("core").get("users").then(function(users){
		console.log("promise works", users);
	})
});