var Reflux = require('reflux');
var Promise = require('bluebird');
var ProjectDataActions = require('../actions/ProjectDataActions');
var MainStore = require('../stores/MainStore');
var CreateTaskInputActions = require('../actions/CreateTaskInputActions');
var TasksStore = require('../stores/TasksStore');
var TasksActions = require('../actions/TasksActions');
var SubtasksActions = require('../actions/SubtasksActions');
var CommentsActions = require('../actions/CommentsActions');
var UserStore = require('../stores/UserStore');
var ProjectsStore = require('../stores/ProjectsStore');
var moment = require('moment');

var _fetchDataTimeout = null;
var _fetchLock = false;
var _lastFetchDate = Date.now();

var clearFetchTimeout = function () {
	if (_fetchDataTimeout) {
		clearTimeout(_fetchDataTimeout);
	}
}

var refetchData = function (init) {
	if (!_fetchLock && !init) {
		ProjectDataActions.fetchData();
	}

	clearFetchTimeout();

	_fetchDataTimeout = setTimeout(refetchData, 15000);
}

var fetchData = function () {
	var now = Date.now();

	// For some reason we are calling this function too often
	// so we want to prevent hitting asana too much
	if (now - _lastFetchDate < 200) {
		return;
	}

	_lastFetchDate = now;

	clearFetchTimeout();
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
		'due_at',
		'notes',
		'completed_at',
		'projects.section',
		'projects.section.name',
		'projects.section.id'
	];
	var usersReq = swipes.service('asana').request('users.findByWorkspace', {
		id: workspaceId,
		opt_fields: 'name,photo'
	});
	var projectsReq = swipes.service('asana').request('projects.findByWorkspace', {
		id: workspaceId,
		opt_fields: 'name'
	});
	var incompleteTasksReq;
	var completedTasksReq;

	if (projectType === 'mytasks') {
		incompleteTasksReq = swipes.service('asana').request('tasks.findAll', {
			assignee: user.email,
			workspace: workspaceId,
			completed_since: 'now',
			limit: 100,
			opt_fields: taskOptFields.join(',')
		});
		completedTasksReq = swipes.service('asana').request('tasks.findAll', {
			assignee: user.email,
			workspace: workspaceId,
			limit: 100,
			opt_fields: taskOptFields.join(',')
		});
	} else {
		incompleteTasksReq = swipes.service('asana').request('tasks.findByProject', {
			id: projectId,
			completed_since: 'now',
			limit: 100,
			opt_fields: taskOptFields.join(',')
		})
		completedTasksReq = swipes.service('asana').request('tasks.findByProject', {
			id: projectId,
			limit: 100,
			opt_fields: taskOptFields.join(',')
		})
	}

	Promise.all([
		incompleteTasksReq,
		completedTasksReq,
		usersReq,
		projectsReq
	])
	.then(function (res) {
		var tasks = [],
				incompleteTasks = [],
				completedTasks = [],
				users = [],
				projects = [];

		// Sometimes the queries are allready fired when we lock the fetching process
		// To prevent wierd behavior we will not do anything with the result
		// if the _fetchLock is true
		if (_fetchLock) {
			return;
		}

		incompleteTasks = res[0].data;
		completedTasks = res[1].data;
		users = res[2].data;
		projects = res[3].data;

		// HACK because reflux-model-extension wants strings for idAttribute
		incompleteTasks.forEach(function (task) {
			task.id = task.id.toString();
		})

		completedTasks.forEach(function (task) {
			task.id = task.id.toString();
		})

		users.forEach(function (user) {
			user.id = user.id.toString();
		})

		projects.forEach(function (project) {
			project.id = project.id.toString();
		})

		// Filter only completed tasks from completedTasks because Asana API is just wrong
		var filteredCompletedTasks = completedTasks.filter(function (task) {
			return task.completed;
		})

		tasks = incompleteTasks.concat(filteredCompletedTasks);

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

		swipes.sendEvent('analytics.action', {name: 'Write comment'});
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
			// Asana is a bitch. A little cheeky bastard.
			// When we are fetching all the tasks the id is a string
			// but right here is a number.... WHAT THE FUCK
			addedTask.id = addedTask.id + '';
			var taskId = addedTask.id;

			TasksActions.createTask(addedTask);

			CreateTaskInputActions.changeState({
				creatTaskLoader: 'inactive',
				disabledInput: false
			});

			// Now we need to add the project with another request.
			// T_TODO Ask the support for this one because in the API docs
			// they say that you can do it with one request when creating the task.
			swipes.sendEvent('analytics.action', {name: 'Create task'});
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

			swipes.sendEvent('analytics.action', {name: 'Create subtask'});
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
			swipes.sendEvent('analytics.action', {name: 'Assign person'});
		})
		.catch(function (error) {
			console.log(error);
		})
		.finally(function () {
			_fetchLock = false;
		})
	},
	onRemoveAssignee: function(task) {
		var taskId = task.id;

		_fetchLock = true;

		// update the task client side
		if (task.parent) {
			SubtasksActions.update(taskId, 'assignee', null);
		} else {
			TasksActions.updateTask(taskId, 'assignee', null);
		}

		swipes.service('asana').request('tasks.update', {
			id: taskId,
			assignee: null
		})
		.then(function () {
			swipes.sendEvent('analytics.action', {name: 'Remove assignee'});
		})
		.catch(function (error) {
			console.log(error);
		})
		.finally(function () {
			_fetchLock = false;
		})
	},
	onRemoveScheduling: function(task) {
		var taskId = task.id;
		var res = null;

		if (task.parent) {
			SubtasksActions.update(taskId, 'due_at', res, false);
			SubtasksActions.update(taskId, 'due_on', res, true);

		} else {
			TasksActions.updateTask(taskId, 'due_at', res, false);
			TasksActions.updateTask(taskId, 'due_on', res, true);
		}

		_fetchLock = true;

		swipes.service('asana').request('tasks.update', {
			id: taskId,
			due_at: null,
			due_on: null
		})
		.then(function () {
			swipes.sendEvent('analytics.action', {name: 'Assign person'});
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
			swipes.sendEvent('analytics.action', {name: 'Complete task'});
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
			var projectType = MainStore.get('settings').projectType;

			if (projectType === 'mytasks') {
				return Promise.resolve(true);
			}

			var tasks = TasksStore.get('tasks');
			var projectId = MainStore.get('settings').projectId;
			var data = {
				id: taskId,
	      project: projectId,
				// tasks[1] because 0 is the actual task that we are trying to move.
				// We moved it client side first in the TasksStore
				insert_before: tasks[1].id
			};

			return swipes.service('asana').request('tasks.addProject', data);
		})
		.then(function () {
			swipes.sendEvent('analytics.action', {name: 'Uncomplete task'});
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
			swipes.sendEvent('analytics.action', {name: 'Delete task'});
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

		var tasks = TasksStore.get('tasks');
    var mappedTasks = tasks.map(function(task) {return task.id; });
    var draggedIdx = mappedTasks.indexOf(draggedId);
    var overIdx = mappedTasks.indexOf(overId);
		var projectId = MainStore.get('settings').projectId;
		var data = {
			id: draggedId,
      project: projectId
		};

		if (placement === 'after') {
			data.insert_after = overId;

			if (draggedIdx > overIdx) {
				overIdx++;
			}
		} else {
			data.insert_before = overId;

			if (draggedIdx < overIdx) {
				overIdx--;
			}
		}

		if (draggedIdx === overIdx) {
			return;
		}

		tasks.splice(overIdx, 0, tasks.splice(draggedIdx, 1)[0]);
		TasksActions.reorderTasks(tasks);

		swipes.service('asana').request('tasks.addProject', data)
			.then(function () {
				swipes.sendEvent('analytics.action', {name: 'Reorder task'});
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
	},
	onScheduleTask: function(task, taskId) {
		var task = task;

		swipes.modal('schedule')(function(res) {
			if (task.parent) {
				SubtasksActions.update(taskId, 'due_at', res);
			} else {
				TasksActions.updateTask(taskId, 'due_at', res);
			}

			if (res) {
				swipes.service('asana').request('tasks.update', {
					id: taskId,
					due_at: res
				})
				.then(function () {
					 swipes.sendEvent('analytics.action', {name: 'Scheduling a task'});
				})
				.catch(function (error) {
					console.log(error);
				})
				.finally(function () {
					_fetchLock = false;
				})
			}
		})
	},
  getTime: function(time) {
    return moment(time).format('hh:mma')
  },
  getDueDate: function(time) {
    var timeString;
    var color;
		var farDays = false;
		var timeNow = moment([]);

    if (timeNow.diff(time, 'days') === -1) {
  		timeString = 'Tomorrow at ';
  		color = 'green';
  	} else if (timeNow.diff(time, 'days') === 1) {
  		timeString = 'Yesterday at ';
  		color = 'red';
  	} else if (timeNow.diff(time, 'days') === 0) {
  		timeString = 'Today at ';
  		color = 'green'
  	} else {
  		if (moment().diff(time) > 0) {
  			timeString = '';
				farDays = true;
  			color = 'red';
  		} else {
  			timeString = '';
				farDays = true;
        color = ''
  		}
  	}

    return {
			timeString: timeString,
			color: color,
			farDays: farDays
		}
  }
});

module.exports = ProjectDataStore;
