var Reflux = require('reflux');
var TaskActions = require('../actions/TaskActions');

var TaskStore = Reflux.createStore({
  listenables: [TaskActions],
	idAttribute: 'id',
  getInitialState: function () {
    return {
      expandDesc: false,
      titleInputValue: null,
      descriptionInputValue: null,
      createdByState: '',
      createdAt: ''
    }
  },
  onExpandDesc: function (newValue) {
    this.set('expandDesc', newValue);
  },
  onTitleChange: function (newValue) {
    this.set('titleInputValue', newValue);
  },
  onDescriptionChange: function (newValue) {
    this.set('descriptionInputValue', newValue);
  },
  addAuthor: function (newValue) {
    this.set('createdByState', newValue);
  },
  addCreatedAt: function (newValue) {
    this.set('createdAt', newValue);
  }
});

module.exports = TaskStore;
