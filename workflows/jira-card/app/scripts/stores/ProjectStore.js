var Reflux = require('reflux');
var Promise = require('bluebird');
var ProjectActions = require('../actions/ProjectActions');
var MainStore = require('../stores/MainStore');

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
		statuses.forEach(function (status) {
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
	var statuses = swipes.service('jira').request('project.getStatuses', {projectIdOrKey: projectKey});
	var issues = swipes.service('jira').request('search.search', {
		//jql: 'project = ' + projectKey + ' AND assignee = currentUser() AND sprint is not EMPTY ORDER BY Rank ASC'
		jql: 'project = ' + projectKey + ' AND sprint is not EMPTY ORDER BY Rank ASC'
	});

	return new Promise(function(resolve, reject) {
		Promise.all([
			statuses,
			issues
		])
		.then(function (res) {
			var issueTypes = res[0].data;
			var issues = res[1].data.issues;
			var statuses = uniqueStatuses(issueTypes);
			var statusesWithIssues = matchIssues(statuses, issues, issueTypes);

			resolve(statusesWithIssues);
		})
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
	}
});

module.exports = ProjectStore;
