var Reflux = require('reflux');

var SubtasksActions = Reflux.createActions([
  'create',
  'remove',
	'update',
  'load',
  'reset'
	// Here you can list your actions
]);

module.exports = SubtasksActions;
