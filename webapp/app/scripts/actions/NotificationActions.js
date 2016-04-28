var Reflux = require('reflux');

var NotificationActions = Reflux.createActions([
	'send',
	'setNotifications'
	// Here you can list your actions
]);

module.exports = NotificationActions;
