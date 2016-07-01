var Reflux = require('reflux');

var TopbarActions = Reflux.createActions([
	'loadWorkflowModal',
	'changeFullscreen',
	'sendFeedback',
	'changeSearch',
	'clearFocusVar'
]);

module.exports = TopbarActions;
