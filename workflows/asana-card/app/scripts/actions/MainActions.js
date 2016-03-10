var Reflux = require('reflux');

var MainActions = Reflux.createActions([
	'updateSettings',
	'expandIssue',
	'changeState',
	'createTask'
	// Here you can list your actions
]);

module.exports = MainActions;
