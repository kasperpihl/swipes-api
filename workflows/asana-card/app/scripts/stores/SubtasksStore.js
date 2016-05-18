var Reflux = require('reflux');
var SubtasksActions = require('../actions/SubtasksActions');

var SubtasksStore = Reflux.createStore({
  listenables: [SubtasksActions],
  getInitialState: function () {
    return {
      subtasks: null,
      completedState: 'inactive',
      createdAt: ''
    }
  },
  onUpdate: function (taskId, field, newValue, trigger) {
    var subtasks = this.get('subtasks');
    var len = subtasks.length;
    var trigger = trigger || true;

    for (var i=0; i<len; i++) {
  		if (taskId === subtasks[i].id) {
  			subtasks[i][field] = newValue;
  			break;
  		}
  	}

    this.set('subtasks', subtasks, {trigger: trigger});
  },
  onRemove: function (taskId) {
    var subtasks = this.get('subtasks');

    subtasks = subtasks.filter(function (subtask) {
			return subtask.id !== taskId;
		})

    this.set('subtasks', subtasks);
  },
  onCreate: function (subtask) {
    var subtasks = this.get('subtasks');

    subtasks.unshift(subtask);
    this.set('subtasks', subtasks);
  },
  onLoad: function (subtasks) {
    this.set('subtasks', subtasks);
  },
  addCreatedAt: function (newValue) {
    this.set('createdAt', newValue);
  }
});

module.exports = SubtasksStore;
