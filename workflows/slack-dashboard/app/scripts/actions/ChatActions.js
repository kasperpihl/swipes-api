var Reflux = require('reflux');

var ChatActions = Reflux.createActions([
	'markAsRead',
	'handleMessage',
	'sendMessage',
	'setChannel',
	'clickLink',
	'updateBadge'
	// Here you can list your actions
]);

module.exports = ChatActions;
