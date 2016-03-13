var Reflux = require('reflux');

var MainActions = Reflux.createActions([
	'updateSettings',
	'expandIssue',
	'changeState'
	// Here you can list your actions
]);

// Need a sync method for controlled inputs in react
// https://github.com/reflux/refluxjs/issues/101
MainActions.changeInputValue = Reflux.createAction({sync: true});

module.exports = MainActions;
