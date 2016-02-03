var Reflux = require('reflux');

var NotificationActions = Reflux.createActions([
	'sendNotification',
	'popNotification'
	// Here you can list your actions
]);

module.exports = NotificationActions;
