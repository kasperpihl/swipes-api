var Reflux = require('reflux');

var SubtasksActions = Reflux.createActions([
  'create',
  'remove',
	'update',
  'load',
  'reset',
  'addCreatedAt'
	// Here you can list your actions
]);

module.exports = SubtasksActions;
