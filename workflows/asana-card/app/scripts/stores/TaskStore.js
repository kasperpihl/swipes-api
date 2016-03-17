var Reflux = require('reflux');
var TaskActions = require('../actions/TaskActions');

var TaskStore = Reflux.createStore({
  listenables: [TaskActions],
	idAttribute: 'id',
  getInitialState: function () {
    return {
      expandDesc: false
    }
  },
  onExpandDesc: function (newValue) {
    this.set('expandDesc', newValue);
  }
});

module.exports = TaskStore;
