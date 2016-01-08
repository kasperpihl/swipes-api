var Reflux = require('reflux');

var ServiceActions = Reflux.createActions([
	'authorize',
	'handleOAuthSuccess'
]);

module.exports = ServiceActions;