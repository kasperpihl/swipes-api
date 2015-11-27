var Reflux = require('reflux');

var ChatActions = Reflux.createActions([
	'sendMessage',
	'editMessage',
	'deleteMessage'
	// Here you can list your actions
]);

module.exports = ChatActions;
