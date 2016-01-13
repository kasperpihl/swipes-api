var Reflux = require('reflux');

var ChannelActions = Reflux.createActions([
	'markAsRead',
	'handleMessage',
	'sendMessage'
	// Here you can list your actions
]);

module.exports = ChannelActions;
