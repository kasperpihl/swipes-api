var Reflux = require('reflux');

var MainActions = Reflux.createActions([
	'updateSettings',
	'createIssue',
	'updateInputValue'
	// Here you can list your actions
]);

module.exports = MainActions;
