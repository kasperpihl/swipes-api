var Reflux = require('reflux');

var IssueActions = Reflux.createActions([
	'workOnIssue',
	'stopWorkOnIssue',
	'completeWorkOnIssue'
	// Here you can list your actions
]);

module.exports = IssueActions;
