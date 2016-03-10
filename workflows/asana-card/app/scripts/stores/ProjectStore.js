var Reflux = require('reflux');
var Promise = require('bluebird');
var ProjectActions = require('../actions/ProjectActions');
var MainStore = require('../stores/MainStore');
var UserStore = require('../stores/UserStore');

var _tasks = [];
var _projects = [];
var _fetchDataTimeout = null;
var _fetchLock = false;

var matchIssues = function (statuses, issues, issueTypes) {
	issues.forEach(function (issue) {
		statuses.forEach(function (status, index) {
			if (issue.fields.status.id === status.id) {
				issueTypes.forEach(function (issueType) {
					if (issue.fields.issuetype.id === issueType.id) {
						issue.statuses = issueType.statuses;
						status.issues.push(issue);
					}
				});
			}
		});
	});

	return statuses;
}

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

var refetchData = function (init) {
	if (!_fetchLock && !init) {
		ProjectActions.fetchData();
	}

	if (_fetchDataTimeout) {
		clearTimeout(_fetchDataTimeout);
	}

	_fetchDataTimeout = setTimeout(refetchData, 10000);
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
			console.log('TASKS');
			console.log(res[0].data);
			console.log('USERS');
			console.log(res[1].data);
			console.log('PROJECTS');
			console.log(res[2].data);

			_tasks = res[0].data;

			var statuses = matchTasks(_tasks);
			// _statuses = uniqueStatuses(_issueTypes);
			// var statusesWithIssues = matchIssues(_statuses, _issues, _issueTypes);
			// var assignable = res[2].data;

			//UserStore.batchLoad(assignable, {flush:true});

			refetchData(true);

			resolve(statuses);
	 	})
	});
}

var changeIssueFieldOnClient = function (issue, field, newValue) {
	var len = _issues.length;

	// Change the issue client side first
	// Most of the time rest requests are successful
	// No need for the user to wait
	for (var i=0; i<len; i++) {
		if (issue.id === _issues[i].id) {
			_issues[i].fields[field] = newValue;
			break;
		}
	}

	// Reset the issues property to prevent dublication when doing the change
	_statuses = uniqueStatuses(_issueTypes);

	return matchIssues(_statuses, _issues, _issueTypes);
}

var transitionIssueOnJira = function (issue, status) {
	return swipes.service('jira').request('issue.getTransitions', {
		issueId: issue.id
	})
	.then(function (res) {
		var transitions = res.data.transitions;
		var promise;

		transitions.forEach(function (transition) {
			if (transition.to.id === status.id) {
				promise = swipes.service('jira').request('issue.transitionIssue', {
					issueId: issue.id, transition: transition.id
				})
			}
		});

		return promise;
	});
}

var assignIssueOnJira = function (issue, assignee) {
	return swipes.service('jira').request('issue.assignIssue', {
		issueId: issue.id,
		assignee: assignee.name
	});
}

var ProjectStore = Reflux.createStore({
	listenables: [ProjectActions],
	getInitialState: function () {
		return {
			statuses: []
		}
	},
	onFetchData: function () {
		var self = this;

		fetchData()
			.then(function (res) {
				self.set('statuses', res);
			});
	},
	onReset: function () {
		this.set('statuses', []);
	},
	onTransitionIssue: function (options) {
		var self = this;
		var issue = options.issue;
		var status = options.status;
		var oldStatus = issue.fields.status;
		var newStatuses = changeIssueFieldOnClient(issue, 'status', status);

		self.set('statuses', newStatuses);
		_fetchLock = true;

		transitionIssueOnJira(issue, status)
			.then(function () {
				// T_TODO We want Kasper's notifications here
				console.log('GOOD');
			})
			.catch(function (err) {
				// T_TODO We want Kasper's notifications here
				// Well our transition failed so return the old state
				var oldStatuses = changeIssueFieldOnClient(issue, 'status', oldStatus);
				self.set('statuses', oldStatuses);
			})
			.finally(function () {
				_fetchLock = false;
			})
	},
	onAssignPerson: function (options) {
		var self = this;
		var issue = options.issue;
		var assignee = options.assignee;
		var oldAssignee = issue.fields.assignee;
		var newStatuses = changeIssueFieldOnClient(issue, 'assignee', assignee);

		self.set('statuses', newStatuses);
		_fetchLock = true;

		assignIssueOnJira(issue, assignee)
			.then(function () {
				// T_TODO We want Kasper's notifications here
				console.log('GOOD');
			})
			.catch(function (err) {
				// T_TODO We want Kasper's notifications here
				// Well our assignment failed so return the old state
				var oldStatuses = changeIssueFieldOnClient(issue, 'assignee', oldAssignee);
				self.set('statuses', oldStatuses);
			})
			.finally(function () {
				_fetchLock = false;
			})
	}
});

module.exports = ProjectStore;
