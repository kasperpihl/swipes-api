var Reflux = require('reflux');

var ProjectActions = Reflux.createActions([
	'fetchData',
	'reset',
	// 'transitionIssue',
	// 'assignPerson',
	'createTask',
	'completeTask' // This is my fav action
]);

module.exports = ProjectActions;
