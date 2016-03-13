var Reflux = require('reflux');
var ChatInputActions = require('../actions/ChatInputActions');

var ChatInputStore = Reflux.createStore({
	listenables: [ChatInputActions],
	idAttribute: 'id',
	getInitialState: function () {
		return {
			inputValue: ''
		}
	},
  onChangeInputValue: function (newValue) {
    this.set('inputValue', newValue);
  }
});

module.exports = ChatInputStore;
