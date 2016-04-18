var Reflux = require('reflux');
var TasksActions = require('../actions/TasksActions');

// It's a hack but our structure of the app is just wrong
_cacheTasks = [];

var TasksStore = Reflux.createStore({
  listenables: [TasksActions],
	idAttribute: 'id',
  getInitialState: function () {
    return {
      loaded: false,
      tasks: [],
      dragging: false
    }
  },
  onCreateTask: function (task) {
    var tasks = this.get('tasks');

    tasks.unshift(task);
    this.setTasks(tasks);
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

    this.setTasks(tasks);
  },
  onRemoveTask: function (taskId) {
    var tasks = this.get('tasks');

    tasks = tasks.filter(function (task) {
			return task.id !== taskId;
		})

    this.setTasks(tasks);
  },
  onLoadTasks: function (tasks) {
    this.set('loaded', true, {trigger: false});
    this.setTasks(tasks);
  },
  onReset: function () {
    this.setTasks([]);
  },
  onDragStart: function () {
    this.set('dragging', true);
  },
  onDragEnd: function () {
    this.set('dragging', false);
  },
  onReorderTasks: function (tasks) {
    this.setTasks(tasks);
  },
  setTasks: function (tasks) {
    _cacheTasks = tasks;
    this.set('tasks', tasks);
  },
  getCachedTasks: function () {
    return _cacheTasks;
  }
});

module.exports = TasksStore;
