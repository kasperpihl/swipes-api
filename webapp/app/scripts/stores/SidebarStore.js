var Reflux = require('reflux');
var sidebarActions = require('../actions/SidebarActions');
var modalActions = require('../actions/ModalActions');
var userStore = require('./UserStore');
var channelStore = require('./ChannelStore');
var appStore = require('./AppStore');
var SidebarStore = Reflux.createStore({
	listenables: [ sidebarActions ],
	onLoadUserModal:function(){
		console.log('loading user modal');
		var filteredUsers = userStore.filter(function(user){ return (user.me) ? false : true });
		modalActions.loadModal("list", {"title": "Write a person", "rows": filteredUsers }, function(row){
			console.log("callback row", row);
			if(row){
				swipes._client.callSwipesApi("im.open", {"user_id": row.id}, function(res,error){
					console.log("res from im", res);
				})
			}
		});
	},
	onLoadChannelModal:function(){
		console.log('loading channel modal');
		var filteredChannels = channelStore.filter(function(channel){ 
			console.log(channel);
			if(channel.type === "public" && !channel.is_member)
				return true; 
			return false; 
		});
		modalActions.loadModal("list", {"title": "Join a channel", "emptyText": "No channels to join", "rows": filteredChannels }, function(row){
			console.log("callback row", row);
			if(row){
				swipes._client.callSwipesApi("channels.join", {"channel_name": row.name}, function(res,error){
					console.log("res from channel", res);
				})
			}
		});
	},
	onLoadAppModal:function(){
		console.log('loading app modal');
		var filteredApps = appStore.filter(function(app){ 
			console.log(app);
			if(!app.is_active)
				return true;
			return false; 
		});
		modalActions.loadModal("list", {"title": "Activate an app", "emptyText": "No apps to activate", "rows": filteredApps }, function(row){
			console.log("callback row", row);
			if(row){
				swipes._client.callSwipesApi("users.activateApp", {"app_id": row.id}, function(res,error){
					console.log("res from app", res);
				})
			}
		});
	}
});

module.exports = SidebarStore;
