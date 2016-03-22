var Reflux = require('reflux');

var ChatInputActions = Reflux.createActions([
	'blur',
	'focus'
]);

// Need a sync method for controlled inputs in react
// https://github.com/reflux/refluxjs/issues/101
ChatInputActions.changeInputValue = Reflux.createAction({sync: true});
ChatInputActions.changeInputTextHeight = Reflux.createAction({sync: true});

module.exports = ChatInputActions;
