var Reflux = require('reflux');
var stateActions = require('../actions/StateActions');
var data = [];
var socketActions = require('../actions/SocketActions');
var appStore = require('../stores/AppStore');
var channelStore = require('../stores/ChannelStore');
var StateStore = Reflux.createStore({
	listenables: [ stateActions ],
	localStorage: "StateStore",
	persistOnly: [ "swipesToken", "sidebarClosed", "isLoggedIn", "isStarted" ],
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
	onUnloadPreview: function(){
		console.log('unloading');
		this.set("preview1", {});
	},
	onLoadPreview: function(appId, scope, id){

		var app = appStore.get(appId);
		if(app){
			var appObj = {
				url: app.preview_view_url + "?id=" + id,
				app: app
			}
			var self = this;
			swipes._client.callSwipesApi("apps.method", {manifest_id: app.manifest_id, method: "preview", data:{scope:scope, id:id}}, function(res, err){
				console.log("result from preview method", res);
				appObj.previewObj = res.res;
				self.set("preview1", appObj);
			});
		}
	},
	onLoadApp: function(params, options){
		options = options || {};

		this.unset("backgroundColor", {trigger: false});
		this.unset("foregroundColor", {trigger: false});
		var index = options.index || "screen1";
		var app, channel, appObj = {};
		var activeMenuId;

		if(params.appId){
			app = appStore.find({"manifest_id":params.appId});
			if(app){
				appObj.url = app.main_app_url;
				appObj.app = app;
				activeMenuId = app.id;
			}
		}
		if(params.groupId){
			channel = channelStore.find({"name":params.groupId});
			if(channel){
				appObj.channel = channel;
				// Adding a get parameter to hack react, otherwise iFrame won't update when switching between channels
				appObj.url = app.channel_view_url + "?cId=" + channel.id;
				activeMenuId = channel.id;
			}
		}

		this.set(index, appObj);
		this.set("active_menu_id", activeMenuId);
	},
	onLogin:function(token){
		this.set("swipesToken", token, {trigger: false});
		this.set("isLoggedIn", true);
	}

});
StateStore.actions = stateActions;
module.exports = StateStore;
