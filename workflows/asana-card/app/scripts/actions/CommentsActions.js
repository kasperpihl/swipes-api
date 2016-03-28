var Reflux = require('reflux');

var CommentsActions = Reflux.createActions([
  'create',
  'remove',
	'update',
  'load'
	// Here you can list your actions
]);

module.exports = CommentsActions;
