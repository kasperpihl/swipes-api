var React = require('react');
var Reflux = require('reflux');
var stateActions = require('../actions/StateActions');
var data = [];
var socketActions = require('../actions/SocketActions');
var WorkflowStore = require('../stores/WorkflowStore');
var browserHistory = require('react-router').browserHistory;

var StateStore = Reflux.createStore({
	listenables: [ stateActions ],
	localStorage: "StateStore",
	persistOnly: [ "swipesToken"],
	onInit: function() {
		if(!swipesApi.getToken()){
			swipesApi.setToken(this.get("swipesToken"));
			socketActions.start();
		}
	},
	onLogin: function(token) {
		this.set("swipesToken", token, {trigger: false});
		return browserHistory.push('/');
	}

});
StateStore.actions = stateActions;
module.exports = StateStore;
