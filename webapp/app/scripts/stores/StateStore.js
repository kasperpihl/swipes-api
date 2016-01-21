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
	onLoadWorkflow: function(params, options){
		options = options || {};

		var index = options.index || "screen1";
		var workflow,  workflowObj = {};
		var activeMenuId;

		this.unset("backgroundColor", {trigger: false});
		this.unset("foregroundColor", {trigger: false});

		if(params.workflowId){
			workflow = WorkflowStore.get(params.workflowId);
			if(workflow){
				workflowObj.url = workflow.index_url;
				workflowObj.workflow = workflow;
				activeMenuId = workflow.id;
			}
		}

		this.set(index, workflowObj);
		this.set("active_menu_id", activeMenuId);
	},
	onLogin: function(token) {
		this.set("swipesToken", token, {trigger: false});
		return browserHistory.push('/');
	}

});
StateStore.actions = stateActions;
module.exports = StateStore;
