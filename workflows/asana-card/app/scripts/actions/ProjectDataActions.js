var Reflux = require('reflux');

var ProjectDataActions = Reflux.createActions([
	'fetchData',
	'reset',
	// 'transitionIssue',
	'assignPerson',
	'createTask',
	'completeTask', // This is my fav action
	'undoCompleteTask',
	'removeTask'
]);

module.exports = ProjectDataActions;
