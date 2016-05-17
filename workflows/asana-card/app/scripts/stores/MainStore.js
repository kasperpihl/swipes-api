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
			commentsView: false,
			workspaces: [],
			sideMenu: false
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
	compareContext: function (projectId, taskId) {
		//var currentWorkspaceId = this.get('settings').workspaceId;
		var currentProjectId = this.get('settings').projectId;

		if (currentProjectId === projectId) {
			return {same: true};
		} else {
			var workspaces = MainStore.getAll();
			var newWorkspaceId = false;

			_.some(workspaces, function (workspace) {
				if (workspace && workspace.id) {
					var projects = workspace.projects;
					var pLen = projects.length;

					for (var i=0; i < pLen; i++) {
						if (projects[i] && projects[i].id.toString() === projectId) {
							newWorkspaceId = workspace.id;
							break;
						}
					}

					if (newWorkspaceId) {
						// break the _.some loop
						return true;
					}
				}
			});

			var projectType = newWorkspaceId === projectId ? 'mytasks' : null;

			return {
				workspaceId: newWorkspaceId,
				projectId: projectId,
				projectType: projectType
			}
		}
	},
	onUpdateSettings: function (newSettings, closeExpandTask) {
		closeExpandTask = closeExpandTask || false;
		TasksActions.reset();
		this.onCloseExpandedTask();

		this.update('settings', newSettings);
		swipes.api.request('users.updateWorkflowSettings', {workflow_id: swipes.info.workflow.id, settings: newSettings}, function(res, err) {
			console.log('trying to update settings', res, err);
		})
	},
	onExpandTask: function (taskId, trigger) {
		trigger = trigger === undefined ? true : trigger;
		// K_TODO for some reason this one still triggers
		// and I had to put additional check in expanded_task
		// just to be sure that the taskId is not invalid
		this.set('expandedTaskId', taskId, {trigger: trigger});
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
		var workspaces;

		swipes.service('asana').request('workspaces.findAll', function (res, err) {
			if (res) {
				workspaces = res.data;
				self.set('workspaces', workspaces);
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
						MainActions.updateSettings(newSettings, true);
					})
					.catch(function (error) {
						console.log(error);
					})
			}
			else {
				console.log(err);
			}
		});
	},
	toggleSideMenu: function() {
		var state = this.get('sideMenu');

		this.set('sideMenu', !state);
	}
});

module.exports = MainStore;
