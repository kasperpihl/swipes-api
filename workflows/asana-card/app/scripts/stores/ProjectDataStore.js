var Reflux = require('reflux');
var Promise = require('bluebird');
var ProjectDataActions = require('../actions/ProjectDataActions');
var MainStore = require('../stores/MainStore');
var CreateTaskInputActions = require('../actions/CreateTaskInputActions');
var TasksActions = require('../actions/TasksActions');
var SubtasksActions = require('../actions/SubtasksActions');
var CommentsActions = require('../actions/CommentsActions');
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

var writeComment = function (taskId, comment) {
	console.log('Writing a comment!');

	swipes.service('asana').request('tasks.addComment', {
		id: taskId,
		text: comment
	})
	.then(function (response) {
		var addedComment = response.data;

		CommentsActions.add(addedComment);

		swipes.analytics.action('Write comment');
	})
	.then(function () {
		console.log('Done!');
	})
	.catch(function (error) {
		console.log(error);
	})
	.finally(function () {
		CreateTaskInputActions.changeState({
			creatTaskLoader: 'inactive',
			disabledInput: false
		});
	})
}

var createTask = function (taskData, projectType, projectId) {
	console.log('Adding task!');
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
			swipes.analytics.action('Create task');
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
}

var createSubTask = function (taskData) {
	console.log('Adding subtask!');
	swipes.service('asana').request('tasks.addSubtask', taskData)
		.then(function (response) {
			var addedTask = response.data;

			SubtasksActions.create(addedTask);

			CreateTaskInputActions.changeState({
				creatTaskLoader: 'inactive',
				disabledInput: false
			});

			swipes.analytics.action('Create subtask');
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
		if (task.parent) {
			SubtasksActions.update(taskId, 'assignee', assignee);
		} else {
			TasksActions.updateTask(taskId, 'assignee', assignee);
		}

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

		if (task.parent) {
			SubtasksActions.update(taskId, 'completed', completed);
		} else {
			TasksActions.updateTask(taskId, 'completed', completed);
		}

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
		if (task.parent) {
			SubtasksActions.update(taskId, 'completed', completed);
		} else {
			TasksActions.updateTask(taskId, 'completed', completed);
		}

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
		if (task.parent) {
			SubtasksActions.remove(taskId);
		} else {
			TasksActions.removeTask(taskId);
		}

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
	onCreateTask: function (task, subtask) {
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
		if (projectType === 'mytasks' && !subtask) {
			assignee = {assignee: {id: settings.user.id}};
		}

		if (!subtask) {
			var taskData = Object.assign(
				{},
				task,
				assignee,
				workspace
			);

			createTask(taskData, projectType, projectId);
		} else {
			var parent = {id : task.parent};

			delete task.parent;

			var taskData = Object.assign(
				{},
				parent,
				task
			);

			createSubTask(taskData);
		}

		this.set('createInputValue', '');
	},
	onReorderTasks: function (draggedId, overId, placement) {
		if (draggedId === overId) {
			return;
		}

		_fetchLock = true;

		var projectId = MainStore.get('settings').projectId;
		var data = {
			id: draggedId,
      project: projectId
		};

		if (placement === 'after') {
			data.insert_after = overId;
		} else {
			data.insert_before = overId;
		}
		// console.log('PROJECT ID +++++++++++++++++')
		// console.log(projectId);

		TasksActions.reorderTasks(draggedId, overId);

		swipes.service('asana').request('tasks.addProject', data)
			.then(function () {
				swipes.analytics.action('Reorder task');
			})
			.catch(function (error) {
				console.log(error);
			})
			.finally(function () {
				_fetchLock = false;
			})
	},
	onWriteComment: function (taskId, comment) {
		CreateTaskInputActions.changeInputValue('');
		CreateTaskInputActions.changeState({
			creatTaskLoader: 'active',
			disabledInput: true
		});

		writeComment(taskId, comment);
	}
});

module.exports = ProjectDataStore;
