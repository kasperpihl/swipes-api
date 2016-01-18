var Reflux = require('reflux');

var StateActions = Reflux.createActions([
	'login',
	'init',
	'changeStarted',
	'changeBackgroundColor',
	'loadWorkflow',
	'loadPreview',
	'unloadPreview',
	'toggleSidebar'

	// Here you can list your actions
]);

module.exports = StateActions;
