var Reflux = require('reflux');
var MainActions = require('../actions/MainActions');
var TasksActions = require('../actions/TasksActions');
var Promise = require('bluebird');

var MainStore = Reflux.createStore({
	listenables: [MainActions],
	idAttribute: 'id',
	getInitialState: function () {
		return {
      expandedTaskId: null,
			commentsView: false
		}
	},
	getShareAction: function () {
		var expandedTaskId = this.get('expandedTaskId');
		var commentsView = this.get('commentsView');
		var action = 'Create a new task';

		if (commentsView) {
			action = 'Write a comment';
		} else if (expandedTaskId) {
			action = 'Create a new subtask';
		}

		return action;
	},
	currentProjectName: function () {
		var workspaceId = this.get('settings').workspaceId;
		var projectId = this.get('settings').projectId;

		if (workspaceId === projectId) {
			return 'My Tasks';
		} else {
			var workspaces = this.getAll();
			var projects = workspaces[workspaceId].projects;

			if (projects.length > 0) {
				var currentProject = projects.find(function (project) {
					return project.id.toString() === projectId;
				})

				if (currentProject !== undefined) {
					return currentProject.name;
				} else {
					return null;
				}
			}
		}
	},
	onUpdateSettings: function (newSettings) {
		console.log('new', newSettings);
		TasksActions.reset();
		MainActions.closeExpandedTask();
		this.update('settings', newSettings);
		swipes.api.request('users.updateWorkflowSettings', {workflow_id: swipes.info.workflow.id, settings: newSettings}, function(res, err) {
			console.log('trying to update settings', res, err);
		})
	},
	onExpandTask: function (taskId) {
		this.set('expandedTaskId', taskId);
	},
	onCloseExpandedTask: function () {
		this.set('commentsView', false, {trigger: false});
		this.set('expandedTaskId', null);
	},
	onCommentsView: function (newValue) {
		this.set('commentsView', newValue);
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
