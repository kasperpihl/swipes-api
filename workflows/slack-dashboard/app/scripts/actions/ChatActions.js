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
	'uploadClipboard',
	'openImage',
	'loadPrivateImage',
	'sendTypingEvent'
	// Here you can list your actions
]);

module.exports = ChatActions;
