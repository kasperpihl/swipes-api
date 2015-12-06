var Reflux = require('reflux');

var StateActions = Reflux.createActions([
	'login',
	'init',
	'changeStarted',
	'changeBackgroundColor',
	'loadApp',
	'toggleSidebar'

	// Here you can list your actions
]);

module.exports = StateActions;
