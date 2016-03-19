var Reflux = require('reflux');

var CreateTaskInputActions = Reflux.createActions([
	'changeState'
	// Here you can list your actions
]);

// Need a sync method for controlled inputs in react
// https://github.com/reflux/refluxjs/issues/101
CreateTaskInputActions.changeInputValue = Reflux.createAction({sync: true});

module.exports = CreateTaskInputActions;
