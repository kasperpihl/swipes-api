var Reflux = require('reflux');
var stateActions = require('../actions/StateActions');
var data = [];
var socketActions = require('../actions/SocketActions');
var appStore = require('../stores/AppStore');
var channelStore = require('../stores/ChannelStore');
var StateStore = Reflux.createStore({
	listenables: [ stateActions ],
	localStorage: "StateStore",
	dontPersist: [ "screen1", "screen2", "screen3", "active_menu_id", "backgroundColor"],
	onInit: function(){
		swipes.setToken(this.get("swipesToken"));
		socketActions.start();
	},
	onChangeBackgroundColor:function(color){
		this.set("backgroundColor", color)
	},
	onToggleSidebar: function(){
		this.set("sidebarClosed", !this.get("sidebarClosed"));
	},
	onChangeStarted: function(isStarted){
		this.set('isStarted', isStarted);
	},
	onLoadApp: function(params, options){
		this.unset("backgroundColor", {trigger: false});
		this.unset("foregroundColor", {trigger: false});
		var app, channel, screen1 = {};
		var activeMenuId;

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
				// Adding a get parameter to hack react, otherwise iFrame won't update when switching between channels
				screen1.url = app.channel_view_url + "?cId=" + channel.id;
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
