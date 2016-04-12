var Reflux = require('reflux');

var ChatActions = Reflux.createActions([
	'markAsRead',
	'handleMessage',
	'sendMessage',
	'deleteMessage',
	'editMessage',
	'setChannel',
	'clickLink',
	'uploadFile',
	'updateBadge',
	'checkSocket',
	'uploadClipboard'
	// Here you can list your actions
]);

module.exports = ChatActions;
