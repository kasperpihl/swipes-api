var Reflux = require('reflux');

var ChatInputActions = Reflux.createActions([
	// Here you can list your actions
]);

// Need a sync method for controlled inputs in react
// https://github.com/reflux/refluxjs/issues/101
ChatInputActions.changeInputValue = Reflux.createAction({sync: true});

module.exports = ChatInputActions;
