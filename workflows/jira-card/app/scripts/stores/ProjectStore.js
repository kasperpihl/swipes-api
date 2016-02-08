var Reflux = require('reflux');
var Promise = require('bluebird');
var ProjectActions = require('../actions/ProjectActions');
var MainStore = require('../stores/MainStore');
var UserStore = require('../stores/UserStore');
var objectAssign = require('object-assign');

var _issueTypes = [];
var _issues = [];
var _statuses = [];
var _fetchDataTimeout = null;
var _fetchLock = false;

var uniqueStatuses = function (issueTypes) {
	var statuses = [];
	var keyCheck = {};

	for (var i = 0 ; i < issueTypes.length ; i++) {
		var type = issueTypes[i];

		for (var j = 0 ; j < type.statuses.length ; j++) {
			var status = type.statuses[j];

			if (!keyCheck[status.id]) {
				var obj = {id: status.id, name: status.name, issues: []};

				statuses.push(obj);
				keyCheck[status.id] = true;
			}
		}
	}

	return statuses;
}

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
	var projectKey = MainStore.get('settings').projectKey;
	var statusesReq = swipes.service('jira').request('project.getStatuses', {projectIdOrKey: projectKey});
	var issuesReq = swipes.service('jira').request('search.search', {
		//jql: 'project = ' + projectKey + ' AND assignee = currentUser() AND sprint is not EMPTY ORDER BY Rank ASC'
		jql: 'project = ' + projectKey + ' AND sprint is not EMPTY ORDER BY Rank ASC'
	});;
	var assignableReq = swipes.service('jira').request('user.searchAssignable', {
		project: projectKey
	});

	return new Promise(function(resolve, reject) {
		Promise.all([
			statusesReq,
			issuesReq,
			assignableReq
		])
		.then(function (res) {
			_issueTypes = res[0].data;
			_issues = res[1].data.issues;
			_statuses = uniqueStatuses(_issueTypes);
			var statusesWithIssues = matchIssues(_statuses, _issues, _issueTypes);
			var assignable = res[2].data;

			UserStore.batchLoad(assignable, {flush:true});

			refetchData(true);

			resolve(statusesWithIssues);
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
