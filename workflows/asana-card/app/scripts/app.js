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

swipes.onMenuButton(function () {
	var workspaces = MainStore.getAll();
	var projects = [];
	var navItems = [];

	_.each(workspaces, function (workspace) {
		if (workspace && workspace.id) {
			projects = workspace.projects;

			if (projects.length > 0) {
				// The default one is 'My Tasks' and it equals to the whole workspace
				if (projects[0].name !== 'My Tasks') {
					projects.unshift({
						id: workspace.id,
						name: 'My Tasks'
					});
				}

				projects.forEach(function (project) {
					// for some reason we accept only strings
					project.id = project.id + '';
					project.title = project.name;

					if(project.id === MainStore.get('settings').workspaceId) {
						project.current = true;
					}
				})
			}

			var item = {
				id: workspace.id,
				title: workspace.name,
				nested: workspace.projects
			};

			if(workspace.id === MainStore.get('settings').workspaceId && projects.length <= 0){
				item.current = true;
			}

			console.log(item);

			navItems.push(item);
		}
	});

	swipes.modal.leftNav({items: navItems}, function (res, err) {
		if (res) {
			MainActions.updateSettings({workspaceId: res});
		}
		console.log('response from nav', res, err);
	})
});
