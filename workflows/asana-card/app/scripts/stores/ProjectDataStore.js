var Reflux = require('reflux');
var Promise = require('bluebird');
var ProjectDataActions = require('../actions/ProjectDataActions');
var MainStore = require('../stores/MainStore');
var CreateTaskInputActions = require('../actions/CreateTaskInputActions');
var TasksActions = require('../actions/TasksActions');
var UserStore = require('../stores/UserStore');
var ProjectsStore = require('../stores/ProjectsStore');

var _fetchDataTimeout = null;
var _fetchLock = false;

var refetchData = function (init) {
	if (!_fetchLock && !init) {
		ProjectDataActions.fetchData();
	}

	if (_fetchDataTimeout) {
		clearTimeout(_fetchDataTimeout);
	}

	_fetchDataTimeout = setTimeout(refetchData, 15000);
}

var fetchData = function () {
	// T_TODO one could optimize things here so when the workspace is not changed
	// one do not need to request users and projects. Only tasks.
	var workspaceId = MainStore.get('settings').workspaceId;
	var projectId = MainStore.get('settings').projectId;
	var projectType = MainStore.get('settings').projectType;
	var user = MainStore.get('settings').user;
	var taskOptFields = [
		'name',
		'assignee',
		'projects',
		'completed',
		'due_on',
		'notes'
	];
	var usersReq = swipes.service('asana').request('users.findByWorkspace', {
		id: workspaceId,
		opt_fields: 'name,photo'
	});
	var projectsReq = swipes.service('asana').request('projects.findByWorkspace', {
		id: workspaceId,
		opt_fields: 'name'
	});
	var tasksReq;

	if (projectType === 'mytasks') {
		tasksReq = swipes.service('asana').request('tasks.findAll', {
			assignee: user.email,
			workspace: workspaceId,
			opt_fields: taskOptFields.join(',')
		});
	} else {
		tasksReq = swipes.service('asana').request('tasks.findByProject', {
			id: projectId,
			opt_fields: taskOptFields.join(',')
		})
	}

	Promise.all([
		tasksReq,
		usersReq,
		projectsReq
	])
	.then(function (res) {
		var tasks = [],
				users = [],
				projects = [];

		// Sometimes the queries are allready fired when we lock the fetching process
		// To prevent wierd behavior we will not do anything with the result
		// if the _fetchLock is true
		if (_fetchLock) {
			return;
		}

		/*console.log('TASKS');
		console.log(res[0].data);
		console.log('USERS');
		console.log(res[1].data);
		console.log('PROJECTS');
		console.log(res[2].data);*/

		tasks = res[0].data;
		users = res[1].data;
		projects = res[2].data;

		// HACK because reflux-model-extension wants strings for idAttribute
		tasks.forEach(function (task) {
			task.id = task.id.toString();
		})

		users.forEach(function (user) {
			user.id = user.id.toString();
		})

		projects.forEach(function (project) {
			project.id = project.id.toString();
		})

		UserStore.batchLoad(users, {flush:true});
		ProjectsStore.batchLoad(projects, {flush:true});
		TasksActions.loadTasks(tasks);

		refetchData(true);
 	})
}

var ProjectDataStore = Reflux.createStore({
	listenables: [ProjectDataActions],
	onFetchData: function () {
		var self = this;

		fetchData();
	},
	onAssignPerson: function (task, userId) {
		var taskId = task.id;
		var assignee = {id: userId};

		_fetchLock = true;

		// update the task client side
		TasksActions.updateTask(taskId, 'assignee', assignee);

		swipes.service('asana').request('tasks.update', {
			id: taskId,
			assignee: assignee
		})
		.then(function () {
			swipes.analytics.action('Assign person');
		})
		.catch(function (error) {
			console.log(error);
		})
		.finally(function () {
			_fetchLock = false;
		})
	},
	onCompleteTask: function (task) {
		var taskId = task.id;
		var completed = true;

		_fetchLock = true;

		// update the task client side
		TasksActions.updateTask(taskId, 'completed', completed);

		swipes.service('asana').request('tasks.update', {
			id: taskId,
			completed: completed
		})
		.then(function () {
			swipes.analytics.action('Complete task');
		})
		.catch(function (error) {
			console.log(error);
		})
		.finally(function () {
			_fetchLock = false;
		})
	},
	onUndoCompleteTask: function (task) {
		var taskId = task.id;
		var completed = false;

		_fetchLock = true;

		// update the task client side
		TasksActions.updateTask(taskId, 'completed', completed);

		swipes.service('asana').request('tasks.update', {
			id: taskId,
			completed: completed
		})
		.then(function () {
			swipes.analytics.action('Uncomplete task');
		})
		.catch(function (error) {
			console.log(error);
		})
		.finally(function () {
			_fetchLock = false;
		})
	},
	onRemoveTask: function (task) {
		var taskId = task.id;

		_fetchLock = true;

		// Remove the task client side
		TasksActions.removeTask(taskId);

		swipes.service('asana').request('tasks.delete', {
			id: taskId
		})
		.then(function () {
			swipes.analytics.action('Delete task');
		})
		.catch(function (error) {
			console.log(error);
		})
		.finally(function () {
			_fetchLock = false;
		})
	},
	onCreateTask: function (task) {
		var settings = MainStore.get('settings');
		var workspaceId = settings.workspaceId;
		var projectId = settings.projectId;
		var projectType = settings.projectType;
		var workspace = {workspace: workspaceId};
		var assignee = {};
		var self = this;

		_fetchLock = true;

		CreateTaskInputActions.changeInputValue('');
		CreateTaskInputActions.changeState({
			creatTaskLoader: 'active',
			disabledInput: true
		});

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

				TasksActions.createTask(addedTask);

				CreateTaskInputActions.changeState({
					creatTaskLoader: 'inactive',
					disabledInput: false
				});

				// Now we need to add the project with another request.
				// T_TODO Ask the support for this one because in the API docs
				// they say that you can do it with one request when creating the task.
				if (projectType !== 'mytasks') {
					return swipes.service('asana').request('tasks.addProject', {
						id: taskId,
						project: projectId
					})
				}
				swipes.analytics.action('Create task');
			})
			.then(function () {
			})
			.catch(function (error) {
				console.log(error);
			})
			.finally(function () {
				_fetchLock = false;
			})

		this.set('createInputValue', '');
	}
});

module.exports = ProjectDataStore;
