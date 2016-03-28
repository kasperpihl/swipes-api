var Reflux = require('reflux');

var CommentsActions = Reflux.createActions([
  'add',
  'remove',
	'update',
  'load'
	// Here you can list your actions
]);

module.exports = CommentsActions;
