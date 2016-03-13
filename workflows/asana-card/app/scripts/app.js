require('reflux-model-extension');
require("react-tap-event-plugin")();

var React = require('react');
var ReactDOM = require('react-dom');
var Home = require('./components/home');
var MainStore = require('./stores/MainStore');
var MainActions = require('./actions/MainActions');

ReactDOM.render(<Home />, document.getElementById('content'));

swipes.onReady (function () {
	MainStore.fetch();
});

swipes.onShareTransmit(function(e) {
	var data = e.data.data;

	if (data.action === 'Create a task') { // We have to do something smarter here
		var text = data.data.text || ''; // e.data.data.data.data...

		MainActions.changeInputValue(text);
		MainActions.changeState({
			addNewTaskIcon: 'active',
			todoInput: 'active'
		});
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

			MainActions.updateSettings(newSettings);
		}
	})
});
