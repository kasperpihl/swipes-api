var Reflux = require('reflux');
var stateActions = require('../actions/StateActions');
var data = [];
var socketHandler = require('../handlers/SocketHandler');

var StateStore = Reflux.createStore({
	listenables: [ stateActions ],
	localStorage: "StateStore",
	dontPersist: ["connectionStatus"],
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
	onLogin:function(token){
		this.set("swipesToken", token, {trigger: false});
		this.set("isLoggedIn", true);
	}

});
StateStore.actions = stateActions;
module.exports = StateStore;
