var Reflux = require('reflux');
var Promise = require('bluebird');
var ProjectDataActions = require('../actions/ProjectDataActions');
var MainStore = require('../stores/MainStore');
var CreateTaskInputActions = require('../actions/CreateTaskInputActions');
var UserStore = require('../stores/UserStore');

var _tasks = [];
var _users = [];
//var _projects = [];
var _fetchDataTimeout = null;
var _fetchLock = false;

var matchTasks = function (tasks) {
	var statuses = [
		{name: 'Incomplete', tasks: []},
		{name: 'Completed', tasks: []},
	];

	tasks.forEach(function (task) {
		if (task.completed) {
			statuses[1].tasks.push(task);
		} else {
			statuses[0].tasks.push(task);
		}
	})

	return statuses;
}

var changeTaskFieldOnClient = function (task, field, newValue) {
	var len = _tasks.length;

	for (var i=0; i<len; i++) {
		if (task.id === _tasks[i].id) {
			_tasks[i][field] = newValue;
			break;
		}
	}

	return matchTasks(_tasks);
}

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
		'due_on'
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

	return new Promise(function(resolve, reject) {
		Promise.all([
			tasksReq,
			usersReq,
			projectsReq
		])
		.then(function (res) {
			// Sometimes the queries are allready fired when we lock the fetching process
			// To prevent wierd behavior we will not do anything with the result
			// if the _fetchLock is true

			if (_fetchLock) {
				return resolve(null);
			}

			console.log('TASKS');
			console.log(res[0].data);
			console.log('USERS');
			console.log(res[1].data);
			console.log('PROJECTS');
			console.log(res[2].data);

			_tasks = res[0].data;
			_users = res[1].data;

			var statuses = matchTasks(_tasks);
			// _statuses = uniqueStatuses(_issueTypes);
			// var statusesWithIssues = matchIssues(_statuses, _issues, _issueTypes);
			// var assignable = res[2].data;

			// HACK because reflux-model-extension wants strings for idAttribute
			_users.forEach(function (user) {
				user.id = user.id.toString();
			})

			UserStore.batchLoad(_users, {flush:true});

			refetchData(true);

			resolve(statuses);
	 	})
	});
}

var ProjectDataStore = Reflux.createStore({
	listenables: [ProjectDataActions],
	getInitialState: function () {
		return {
			statuses: []
		}
	},
	onFetchData: function () {
		var self = this;

		fetchData()
			.then(function (res) {
				if (res) {
					self.set('statuses', res);
				}
			});
	},
	onReset: function () {
		this.set('statuses', []);
	},
	onAssignPerson: function (task, userId) {
		var taskId = task.id;

		_fetchLock = true;

		// update the task client side
		this.set('statuses', changeTaskFieldOnClient(task, 'assignee', {id: userId}));

		swipes.service('asana').request('tasks.update', {
			id: taskId,
			assignee: {id: userId}
		})
		.then(function () {
			console.log('Done!');
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
		this.set('statuses', changeTaskFieldOnClient(task, 'completed', completed));

		swipes.service('asana').request('tasks.update', {
			id: taskId,
			completed: completed
		})
		.then(function () {
			console.log('Done!');
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
		this.set('statuses', changeTaskFieldOnClient(task, 'completed', completed));

		swipes.service('asana').request('tasks.update', {
			id: taskId,
			completed: completed
		})
		.then(function () {
			console.log('Done!');
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

		_tasks = _tasks.filter(function (task) {
			return task.id !== taskId;
		})

		this.set('statuses', matchTasks(_tasks));

		swipes.service('asana').request('tasks.delete', {
			id: taskId
		})
		.then(function () {
			console.log('Done!');
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

		console.log('Adding task!');
		swipes.service('asana').request('tasks.create', taskData)
			.then(function (response) {
				var addedTask = response.data;
				var taskId = addedTask.id;

				_tasks.unshift(addedTask);
				self.set('statuses', matchTasks(_tasks));

				CreateTaskInputActions.changeState({
					creatTaskLoader: 'inactive',
					disabledInput: false
				});

				// Now we need to add the project with another request.
				// T_TODO Ask the support for this one because in the API docs
				// they say that you can do it with one request when creating the task.
				if (projectType !== 'mytasks') {
					console.log('Adding task to a project!');
					return swipes.service('asana').request('tasks.addProject', {
						id: taskId,
						project: projectId
					})
				}
			})
			.then(function () {
				console.log('Done!');
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
