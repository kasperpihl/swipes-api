var Reflux = require('reflux');
var Promise = require('bluebird');
var ProjectActions = require('../actions/ProjectActions');
var MainStore = require('../stores/MainStore');
var objectAssign = require('object-assign');

var _issueTypes = [];
var _issues = [];
var _statuses = [];

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

var fetchData = function (options) {
	var projectKey = MainStore.get('settings').projectKey;
	var statusesReq = swipes.service('jira').request('project.getStatuses', {projectIdOrKey: projectKey});
	var issuesReq = swipes.service('jira').request('search.search', {
		//jql: 'project = ' + projectKey + ' AND assignee = currentUser() AND sprint is not EMPTY ORDER BY Rank ASC'
		jql: 'project = ' + projectKey + ' AND sprint is not EMPTY ORDER BY Rank ASC'
	});

	return new Promise(function(resolve, reject) {
		Promise.all([
			statusesReq,
			issuesReq
		])
		.then(function (res) {
			_issueTypes = res[0].data;
			_issues = res[1].data.issues;
			_statuses = uniqueStatuses(_issueTypes);
			var statusesWithIssues = matchIssues(_statuses, _issues, _issueTypes);

			resolve(statusesWithIssues);
		})
	});
}

var transitionIssueOnClient = function (issue, status) {
	var len = _issues.length;

	// Move the issue client side first
	// Most of the time rest requests are successful
	// No need for the user to wait
	for (var i=0; i<len; i++) {
		if (issue.id === _issues[i].id) {
			_issues[i].fields.status = status;
			break;
		}
	}

	// Reset the issues property to prevent dublication when transition issues
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
		var newStatuses = transitionIssueOnClient(issue, status);

		self.set('statuses', newStatuses);

		transitionIssueOnJira(issue, status)
			.then(function () {
				// T_TODO We want Kasper's notifications here
				console.log('GOOD');
			})
			.catch(function (err) {
				// T_TODO We want Kasper's notifications here
				// Well our transition failed so return the old state
				var oldStatuses = transitionIssueOnClient(issue, oldStatus);
				self.set('statuses', oldStatuses);
			})
	}
});

module.exports = ProjectStore;
