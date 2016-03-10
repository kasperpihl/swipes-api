var Reflux = require('reflux');
var MainActions = require('../actions/MainActions');
var ProjectActions = require('../actions/ProjectActions');
var Promise = require('bluebird');

var MainStore = Reflux.createStore({
	listenables: [MainActions],
	idAttribute: 'id',
	getInitialState: function () {
		return {
      //expandedIssueId: null
			addNewTaskIcon: 'inactive',
			todoInput: 'inactive',
			createInputValue: ''
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
	onChangeState: function (newState) {
		// Workaround for magic code here and there
		for (var state in newState) {
			this.set(state, newState[state], {trigger: false});
		}

		this.manualTrigger();
	},
	fetch: function () {
		var self = this;
		var projectsPromises = [];
		var newSettings = {};

		swipes.service('asana').request('workspaces.findAll', function (res, err) {
			if (res) {
				var workspaces = res.data;

				// HACK because reflux-model-extension wants strings for idAttribute
				workspaces.forEach(function (workspace) {
					var promise;

					workspace.id = workspace.id.toString();
					promise = swipes.service('asana').request('projects.findByWorkspace', {
						id: workspace.id
					});

					projectsPromises.push(promise);
				});

				Promise.all(projectsPromises)
					.then(function (projects) {
						workspaces.forEach(function (workspace, index) {
							var singleProjects = projects[index].data;

							singleProjects.unshift({
								id: workspace.id,
								name: 'My Tasks'
							});

							workspace.projects = singleProjects;
						});

						var workspaceId = swipes.info.workflow.settings.workspaceId;

						self.batchLoad(workspaces);

						if (!workspaceId && workspaces[0]) {
							workspaceId = workspaces[0].id;

							newSettings.workspaceId = workspaceId;
							newSettings.projectId = workspaceId;
							newSettings.projectType = 'mytasks';
						} else {
							newSettings = swipes.info.workflow.settings;
						}

						return swipes.service('asana').request('users.me', {});
					})
					.then(function (me) {
						// T_TODO it would be better if the information for the user
						// is already in the settings when you installed the card
						// this would be pretty easy once we implement for all services
						// to add the user data to them.
						var user = me.data;
						delete user.photo;
						delete user.workspaces;

						newSettings.user = user;
						MainActions.updateSettings(newSettings);
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
