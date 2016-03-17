var Reflux = require('reflux');

var ProjectDataActions = Reflux.createActions([
	'fetchData',
	'assignPerson',
	'createTask',
	'completeTask', // This is my fav action
	'undoCompleteTask',
	'removeTask'
]);

module.exports = ProjectDataActions;
