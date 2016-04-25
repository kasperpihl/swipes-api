var Reflux = require('reflux');

var ProjectDataActions = Reflux.createActions([
	'fetchData',
	'assignPerson',
	'createTask',
	'completeTask', // This is my fav action
	'undoCompleteTask',
	'removeTask',
	'writeComment',
	'scheduleTask',
	'removeScheduling',
	'removeAssignee'
]);

//Sync actions
ProjectDataActions.reorderTasks = Reflux.createAction({sync: true});

module.exports = ProjectDataActions;
