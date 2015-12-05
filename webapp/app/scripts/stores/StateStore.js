var Reflux = require('reflux');
var stateActions = require('../actions/StateActions');
var data = [];
var socketHandler = require('../handlers/SocketHandler');
var appStore = require('../stores/AppStore');
var channelStore = require('../stores/ChannelStore');
var StateStore = Reflux.createStore({
	listenables: [ stateActions ],
	localStorage: "StateStore",
	dontPersist: ["connectionStatus", "screen1", "screen2", "screen3", "active_menu_id"],
	defaults: {
		"connectionStatus": "offline"
	},
	onInit: function(){
		swipes.setToken(this.get("swipesToken"));
		socketHandler.start();
	},
	onToggleSidebar: function(){
		this.set("sidebarClosed", !this.get("sidebarClosed"));
	},
	onChangeStarted: function(isStarted){
		this.set('isStarted', isStarted);
	},
	onChangeConnection: function(status){
		this.set("connectionStatus", status);
	},
	onLoadApp: function(params, options){
		var app, channel, screen1 = {};
		var activeMenuId;
		console.log("loading app", params);

		if(params.appId){
			app = appStore.find({"manifest_id":params.appId});
			if(app){
				screen1.url = app.main_app_url;
				screen1.app = app;
				activeMenuId = app.id;
			}
		}
		if(params.groupId){
			channel = channelStore.find({"name":params.groupId});
			if(channel){
				screen1.channel = channel;
				screen1.url = app.channel_view_url;
				activeMenuId = channel.id;
			}
		}

		this.set("screen1", screen1);
		this.set("active_menu_id", activeMenuId);
	},
	onLogin:function(token){
		this.set("swipesToken", token, {trigger: false});
		this.set("isLoggedIn", true);
	}

});
StateStore.actions = stateActions;
module.exports = StateStore;
