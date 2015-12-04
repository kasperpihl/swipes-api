var Reflux = require('reflux');

var StateActions = Reflux.createActions([
	'login',
	'init',
	'changeStarted',
	'changeConnection',
	'toggleSidebar'

	// Here you can list your actions
]);

module.exports = StateActions;
