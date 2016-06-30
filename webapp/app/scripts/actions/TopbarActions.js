var Reflux = require('reflux');

var TopbarActions = Reflux.createActions([
	'loadWorkflowModal',
	'changeFullscreen',
	'sendFeedback'
]);

module.exports = TopbarActions;
