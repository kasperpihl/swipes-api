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
	var workspaces = MainStore.getAll();
	var navItems = [];

	_.each(workspaces, function (workspace) {
		if (workspace && workspace.id) {
			var projects = workspace.projects;
			var projectItems = [];

			// The default one is 'My Tasks' and it equals to the whole workspace
			if (projects[0].name !== 'My Tasks') {
				projects.unshift({
					id: workspace.id,
					name: 'My Tasks'
				});
			}

			projects.forEach(function (project) {
				var projectItem = {
					id: workspace.id + '|' + project.id,
					title: project.name,
					current: project.id.toString() === MainStore.get('settings').projectId,
				}

				projectItems.push(projectItem);
			})

			var item = {
				id: workspace.id,
				title: workspace.name,
				nested: projectItems
			};

			if(workspace.id === MainStore.get('settings').workspaceId && projects.length <= 0){
				item.current = true;
			}

			navItems.push(item);
		}
	});

	swipes.modal.leftNav({items: navItems}, function (res, err) {
		console.log('response from nav', res, err);

		if (!res) {
			return;
		}

		var values = res.split('|');
		var workspaceId = values[0];
		var projectId = values[1];
		var newSettings = {
			workspaceId: workspaceId,
			projectId: projectId,
			projectType: null
		};

		if (workspaceId && projectId) {
			if (workspaceId === projectId) {
				newSettings.projectType = 'mytasks'
			}

			MainActions.updateSettings(newSettings, true);
		}
	})
});
