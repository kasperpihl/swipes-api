var Reflux = require('reflux');

var MainActions = Reflux.createActions([
	'updateSettings',
	'expandTask',
	'closeExpandedTask',
	'commentsView'
	// Here you can list your actions
]);

module.exports = MainActions;
