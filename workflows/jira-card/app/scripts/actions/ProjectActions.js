var Reflux = require('reflux');

var ProjectActions = Reflux.createActions([
	'fetchData',
	'reset',
	'transitionIssue'
	// Here you can list your actions
]);

module.exports = ProjectActions;
