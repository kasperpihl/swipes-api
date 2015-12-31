var Reflux = require('reflux');

var ChatActions = Reflux.createActions([
	'sendMessage',
	'setThread',
	'editMessage',
	'deleteMessage'
	// Here you can list your actions
]);

module.exports = ChatActions;
