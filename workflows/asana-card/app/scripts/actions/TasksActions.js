var Reflux = require('reflux');

var TasksActions = Reflux.createActions([
  'createTask',
  'removeTask',
	'updateTask',
  'loadTasks',
  'dragStart',
  'dragEnd'
]);

//Sync actions
TasksActions.reorderTasks = Reflux.createAction({sync: true});
TasksActions.reset = Reflux.createAction({sync: true});

module.exports = TasksActions;
