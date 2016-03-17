var Reflux = require('reflux');

var MainActions = Reflux.createActions([
	'updateSettings',
	'expandTask',
	'closeExpandedTask'
	// Here you can list your actions
]);

module.exports = MainActions;
