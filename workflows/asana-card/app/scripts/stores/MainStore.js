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
	onCreateTask: function (task) {
		var settings = this.get('settings');
		var workspaceId = settings.workspaceId;
		var projectId = settings.projectId;
		var projectType = settings.projectType;
		var workspace = {workspace: workspaceId};
		var assignee = {};

		// If the tasks is in mytasks it should be private and assigned to me
		// otherwise it should be public and assigned to no one
		// the public property is handled automaticly by the API
		if (projectType === 'mytasks') {
			assignee = {assignee: {id: settings.user.id}};
		}

		var taskData = Object.assign(
			{},
			task,
			assignee,
			workspace
		);

		swipes.service('asana').request('tasks.create', taskData)
			.then(function (response) {
				var addedTask = response.data;
				var taskId = addedTask.id;
				// Now we need to add the project with another request.
				// T_TODO Ask the support for this one because in the API docs
				// they say that you can do it with one request when creating the task.
				if (projectType !== 'mytasks') {
					return swipes.service('asana').request('tasks.addProject', {
						id: taskId,
						project: projectId
					})
				} else {
					console.log('Task added in My tasks!');
				}
			})
			.then(function (task) {
				console.log('Task added in some project');
			})
			.catch(function (error) {
				console.log(error);
			})

		this.set('createInputValue', '');
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
