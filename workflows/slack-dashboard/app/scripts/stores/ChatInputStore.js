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
	onBlur: function(){
		this.set('isFocused', false);
	},
	onFocus: function(){
		this.set('isFocused', true);
	},
	onChangeInputTextHeight:function(newHeight){
		this.set('inputTextHeight', newHeight);
	},
  onChangeInputValue: function (newValue) {
    this.set('inputValue', newValue);
  }
});

module.exports = ChatInputStore;
