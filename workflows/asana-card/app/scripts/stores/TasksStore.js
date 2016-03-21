var Reflux = require('reflux');
var TasksActions = require('../actions/TasksActions');

var TasksStore = Reflux.createStore({
  listenables: [TasksActions],
	idAttribute: 'id',
  getInitialState: function () {
    return {
      tasks: []
    }
  },
  onCreateTask: function (task) {
    var tasks = this.get('tasks');

    tasks.unshift(task);
    this.set('tasks', tasks);
  },
  onUpdateTask: function (taskId, field, newValue) {
    var tasks = this.get('tasks');
    var len = tasks.length;

    for (var i=0; i<len; i++) {
  		if (taskId === tasks[i].id) {
  			tasks[i][field] = newValue;
  			break;
  		}
  	}

    this.set('tasks', tasks);
  },
  onRemoveTask: function (taskId) {
    var tasks = this.get('tasks');

    tasks = tasks.filter(function (task) {
			return task.id !== taskId;
		})

    this.set('tasks', tasks);
  },
  onLoadTasks: function (tasks) {
    this.set('tasks', tasks);
  },
  onReset: function () {
    this.set('tasks', []);
  }
});

module.exports = TasksStore;
