var Reflux = require('reflux');

var ChatActions = Reflux.createActions([
	'markAsRead',
	'handleMessage',
	'sendMessage',
	'setChannel',
	'clickLink',
	'uploadFile',
	'updateBadge',
	'checkSocket'
	// Here you can list your actions
]);

module.exports = ChatActions;
