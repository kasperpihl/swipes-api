var Reflux = require('reflux');
var CreateTaskInputActions = require('../actions/CreateTaskInputActions');

var CreateTaskInputStore = Reflux.createStore({
	listenables: [CreateTaskInputActions],
	getInitialState: function () {
		return {
			inputValue: '',
      creatTaskLoader: 'inactive',
      disabledInput: true
		}
	},
  onChangeInputValue: function (newValue) {
    this.set('inputValue', newValue);
  },
  onChangeState: function (newState) {
		// Workaround for magic code here and there
		for (var state in newState) {
			this.set(state, newState[state], {trigger: false});
		}

		this.manualTrigger();
	}
});

module.exports = CreateTaskInputStore;
