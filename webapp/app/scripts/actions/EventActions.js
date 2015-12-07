var Reflux = require('reflux');

var EventActions = Reflux.createActions([
	'add',
	'remove',
	'fire'
	// Here you can list your actions
]);

module.exports = EventActions;
