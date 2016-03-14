var Reflux = require('reflux');
var Promise = require('bluebird');
var MainActions = require('../actions/MainActions');

var MainStore = Reflux.createStore({
	listenables: [MainActions],
	idAttribute: 'key',
	getInitialState: function () {
		return {
			button: {
				disabled: false
			},
			issueTitle: {value: ''},
			issueDescription: {value: ''}
		}
	},
	onUpdateInputValue: function (type, value) {
		this.update(type, {value: value});
	},
	onCreateIssue: function (issue, refs) {
		var self = this;

		self.update('button', {disabled: true});

		swipes.service('jira').request('issue.createIssue', issue)
			.then(function (res) {
				console.log('ISSUE ADDED');
				console.log(res);
				self.update('issueTitle', {value: refs.issueTitle.props.defaultValue});
				self.update('issueDescription', {value: refs.issueDescription.props.defaultValue});
			})
			.catch(function (err) {
				console.log('Creating issue failed');
				console.log(err);
			})
			.finally(function () {
				self.update('button', {disabled: false});
			})
	},
	onUpdateSettings: function (newSettings) {
		var self = this;
		var projectName;

		self.update('settings', newSettings);
		projectName = self.getAll()[newSettings.projectKey].name;
		swipes.navigation.setTitle(projectName);
		swipes.api.request('users.updateWorkflowSettings', {workflow_id: swipes.info.workflow.id, settings: newSettings}, function(res, err) {
			console.log('trying to update settings', res, err);
		})
	},
	fetch: function () {
		var self = this;

		swipes.service('jira').request('project.getAllProjects', function (res, err) {
			if (res) {
				var projects = res.data;
				var projectKey = swipes.info.workflow.settings.projectKey;
				var projectName;

				self.batchLoad(projects);

				if (!projectKey && projects[0]) {
					projectKey = projects[0].key;
					projectName = projects[0].name;
					swipes.navigation.setTitle(projectName);

					return MainActions.updateSettings({projectKey: projectKey});
				} else {
					projectName = self.getAll()[projectKey].name;
					swipes.navigation.setTitle(projectName);
					self.set('settings', swipes.info.workflow.settings);
				}
			}
			else {
				console.log(err);
			}
		});
	}
});

module.exports = MainStore;
