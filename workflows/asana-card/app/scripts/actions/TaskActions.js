var Reflux = require('reflux');

var TaskActions = Reflux.createActions([
  'expandDesc',
  'addAuthor',
  'addCreatedAt'
	// Here you can list your actions
]);

module.exports = TaskActions;
