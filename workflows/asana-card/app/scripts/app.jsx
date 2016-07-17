require('reflux-model-extension');
require("react-tap-event-plugin")();

var React = require('react');
var ReactDOM = require('react-dom');
var Home = require('./components/home');
var MainStore = require('./stores/MainStore');
var MainActions = require('./actions/MainActions');
var CreateTaskInputActions = require('./actions/CreateTaskInputActions');

ReactDOM.render(<Home />, document.getElementById('content'));
swipes.ready(function () {
	console.log(swipes.info);
	MainStore.fetch();
});

swipes.addListener('request.preOpenUrl', function(e) {
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

swipes.addListener('request.openUrl', function(e) {
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


swipes.addListener('share.provideDropzones', function(e) {
	var projectName = MainStore.currentProjectName();
	var action = MainStore.getShareAction();

	if (projectName) {
		return {
			name: projectName +' - ' + action,
			action: action
		}
	}
});

swipes.addListener('share.receivedData', function(msg) {
	var input = msg.data.text || msg.data.url || '';

	if (input) {
		CreateTaskInputActions.changeInputValue(input);
		document.getElementById('create-task-input').focus();
	}
});

swipes.addListener('menu.button', function(){
	MainActions.toggleSideMenu();
})
