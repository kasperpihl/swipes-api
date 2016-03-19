var Reflux = require('reflux');
var SubtasksActions = require('../actions/SubtasksActions');

var SubtasksStore = Reflux.createStore({
  listenables: [SubtasksActions],
  getInitialState: function () {
    return {
      subtasks: null
    }
  },
  onUpdate: function (taskId, field, newValue) {
    var subtasks = this.get('subtasks');
    var len = subtasks.length;

    for (var i=0; i<len; i++) {
  		if (taskId === subtasks[i].id) {
  			subtasks[i][field] = newValue;
  			break;
  		}
  	}

    this.set('subtasks', subtasks);
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
  }
});

module.exports = SubtasksStore;
