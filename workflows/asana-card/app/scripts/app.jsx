require('reflux-model-extension');
require("react-tap-event-plugin")();

var React = require('react');
var ReactDOM = require('react-dom');
var Home = require('./components/home');
var MainStore = require('./stores/MainStore');
var MainActions = require('./actions/MainActions');
var CreateTaskInputActions = require('./actions/CreateTaskInputActions');

ReactDOM.render(<Home />, document.getElementById('content'));

swipes.onReady (function () {
	MainStore.fetch();
});

swipes.onRequestPreOpenUrl(function(e) {
	var url = e.data.data.url;
	var projectName = MainStore.currentProjectName();

	// T_TODO this is no the right place to do that check...
	// just a fast test
	if (url.match(/https:\/\/app\.asana\.com\/0\/\d+\/\d+/)) {
		return {
			name: 'Asana - ' + projectName
		};
	}

	return null;
});

swipes.onRequestOpenUrl(function(e) {
	var url = e.data.data.url;
	var urlParts = url.split('/');
	var projectId = urlParts[urlParts.length-2];
	var taskId = urlParts[urlParts.length-1];

	if (projectId.match(/\d+/) && taskId.match(/\d+/)) {
		var context = MainStore.compareContext(projectId, taskId);

		if (context.same) {
			MainActions.expandTask(taskId);
		} else {
			MainActions.updateSettings(context);
			MainActions.expandTask(taskId);
		}
	}
});

swipes.onShareInit(function(e) {
	var projectName = MainStore.currentProjectName();
	var action = MainStore.getShareAction();

	if (projectName) {
		return {
			name: projectName +' - ' + action,
			action: action
		}
	}
});

swipes.onShareTransmit(function(e) {
	var data = e.data.data;

	var input = data.data.text || data.data.url || ''; // e.data.data.data.data...

	if (input) {
		CreateTaskInputActions.changeInputValue(input);
		document.getElementById('create-task-input').focus();
	}
});

swipes.onMenuButton(function () {
	MainActions.toggleSideMenu();
});
