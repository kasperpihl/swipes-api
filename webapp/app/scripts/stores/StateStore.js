var Reflux = require('reflux');
var stateActions = require('../actions/StateActions');
var data = [];
var socketActions = require('../actions/SocketActions');
var WorkflowStore = require('../stores/WorkflowStore');
var StateStore = Reflux.createStore({
	listenables: [ stateActions ],
	localStorage: "StateStore",
	persistOnly: [ "swipesToken", "sidebarClosed", "isLoggedIn", "isStarted" ],
	onInit: function() {
		swipes.setToken(this.get("swipesToken"));
		socketActions.start();
		this.debouncedLoadAppPreview = _.debounce(this.loadAppPreview, 700);
	},
	onChangeBackgroundColor: function (color) {
		this.set("backgroundColor", color)
	},
	onToggleSidebar: function () {
		this.set("sidebarClosed", !this.get("sidebarClosed"));
	},
	onChangeStarted: function (isStarted) {
		this.set('isStarted', isStarted);
	},
	onLoadApp: function(params, options){
		options = options || {};

		var index = options.index || "screen1";
		var app,  appObj = {};
		var activeMenuId;

		this.unset("backgroundColor", {trigger: false});
		this.unset("foregroundColor", {trigger: false});

		if(params.appId){
			app = _.findWhere(WorkflowStore.getAll(), {"manifest_id":params.appId});
			if(app){
				appObj.url = app.main_app_url;
				appObj.app = app;
				activeMenuId = app.id;
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
