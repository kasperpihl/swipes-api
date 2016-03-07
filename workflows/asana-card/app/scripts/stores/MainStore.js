var Reflux = require('reflux');
var MainActions = require('../actions/MainActions');
var ProjectActions = require('../actions/ProjectActions');
var Promise = require('bluebird');

var MainStore = Reflux.createStore({
	listenables: [MainActions],
	idAttribute: 'id',
	getInitialState: function () {
		return {
      expandedIssueId: null
		}
	},
	onUpdateSettings: function (newSettings) {
		console.log('new', newSettings);
		ProjectActions.reset();
		this.update('settings', newSettings);
		swipes.api.request('users.updateWorkflowSettings', {workflow_id: swipes.info.workflow.id, settings: newSettings}, function(res, err) {
			console.log('trying to update settings', res, err);
		})
	},
	onExpandIssue: function (issueId) {
		this.set('expandedIssueId', issueId);
	},
	fetch: function () {
		var self = this;
		var projectsPromises = [];

		swipes.service('asana').request('workspaces.findAll', function (res, err) {
			if (res) {
				var workspaces = res.data;

				// HACK because reflux-model-extension wants strings for idAttribute
				workspaces.forEach(function (workspace) {
					var promise;

					workspace.id = '' + workspace.id;
					promise = swipes.service('asana').request('projects.findByWorkspace', {
						id: workspace.id
					});

					projectsPromises.push(promise);
				});

				Promise.all(projectsPromises)
					.then(function (projects) {
						workspaces.forEach(function (workspace, index) {
							workspace.projects = projects[index].data;
						});

						var workspaceId = swipes.info.workflow.settings.workspaceId;

						self.batchLoad(workspaces);

						if (!workspaceId && workspaces[0]) {
							workspaceId = workspaces[0].id;

							MainActions.updateSettings({workspaceId: workspaceId});
						} else {
							self.set('settings', swipes.info.workflow.settings);
						}

						return swipes.service('asana').request('users.me', {});
					})
					.then(function (me) {
						// T_TODO it would be better if the information for the user
						// is already in the settings when you installed the card
						// this would be pretty easy once we implement for all services
						// to add the user data to them.
						delete me.data.photo;
						delete me.data.workspaces;

						MainActions.updateSettings({user: me});
					})
					.catch(function (error) {
						console.log(error);
					})
			}
			else {
				console.log(err);
			}
		});
	}
});

module.exports = MainStore;
