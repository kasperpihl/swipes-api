var Reflux = require('reflux');

var MainActions = Reflux.createActions([
	'updateSettings',
	'createIssue'
	// Here you can list your actions
]);

module.exports = MainActions;
