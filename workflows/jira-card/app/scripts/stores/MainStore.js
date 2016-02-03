var Reflux = require('reflux');
var MainActions = require('../actions/MainActions');
var MainStore = Reflux.createStore({
	listenables: [MainActions],
	onUpdateSettings: function (newSettings) {
		console.log('new', newSettings);
		this.update('settings', newSettings);
		swipes.api.request('users.updateWorkflowSettings', {workflow_id: swipes.info.workflow.id, settings: newSettings}, function(res, err) {
			console.log('trying to update settings', res, err);
		})
	},
	onLoadStatuses: function () {

	},
	fetch: function () {
		var self = this;
		this.set('settings', swipes.info.workflow.settings);
	}
});

module.exports = MainStore;
