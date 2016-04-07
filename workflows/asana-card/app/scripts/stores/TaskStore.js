var Reflux = require('reflux');
var TaskActions = require('../actions/TaskActions');

var TaskStore = Reflux.createStore({
  listenables: [TaskActions],
	idAttribute: 'id',
  getInitialState: function () {
    return {
      expandDesc: false,
      expandedState: 'keyboard_arrow_down',
      descEditingState: 'inactive',
      titleEditingState: 'inactive',
      createdByState: '',
      createdAt: ''
    }
  },
  onExpandDesc: function (newValue) {
    this.set('expandDesc', newValue);
  },
  addAuthor: function (newValue) {
    this.set('createdByState', newValue);
  },
  addCreatedAt: function (newValue) {
    this.set('createdAt', newValue);
  }
});

module.exports = TaskStore;
