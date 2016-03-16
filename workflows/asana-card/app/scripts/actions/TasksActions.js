var Reflux = require('reflux');

var TasksActions = Reflux.createActions([
  'createTask',
  'removeTask',
	'updateTask',
  'loadTasks',
  'reset'
	// Here you can list your actions
]);

module.exports = TasksActions;
