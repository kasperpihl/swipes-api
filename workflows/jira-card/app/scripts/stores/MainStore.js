var Reflux = require('reflux');
var MainActions = require('../actions/MainActions');

var MainStore = Reflux.createStore({
	listenables: [MainActions],
	idAttribute: 'key',
	getInitialState: function () {
		return {
      expandedIssueId: null
		}
	},
	onUpdateSettings: function (newSettings) {
		console.log('new', newSettings);
		this.update('settings', newSettings);
		swipes.api.request('users.updateWorkflowSettings', {workflow_id: swipes.info.workflow.id, settings: newSettings}, function(res, err) {
			console.log('trying to update settings', res, err);
		})
	},
	onExpandIssue: function (issueId) {
		this.set('expandedIssueId', issueId);
	},
	fetch: function () {
		var self = this;

		swipes.service('jira').request('project.getAllProjects', function (res, err) {
			if (res) {
				var projects = res.data;
				var projectKey = swipes.info.workflow.settings.projectKey;

				self.batchLoad(projects);

				if (!projectKey && projects[0]) {
					projectKey = projects[0].key;

					return MainActions.updateSettings({projectKey: projectKey});
				}

				self.set('settings', swipes.info.workflow.settings);
			}
			else {
				console.log(err);
			}
		});
	}
});

module.exports = MainStore;
