var Reflux = require('reflux');
var TasksActions = require('../actions/TasksActions');

// It's a hack but our structure of the app is just wrong
var _cacheTasks = [];

var TasksStore = Reflux.createStore({
  listenables: [TasksActions],
	idAttribute: 'id',
  getInitialState: function () {
    return {
      loaded: false,
      tasks: [],
      dragging: false,
      activeTab: 'inactive',
      commentsNumber: 0,
      attachmentsNumber: 0
    }
  },
  onCreateTask: function (task) {
    var tasks = this.get('tasks');

    tasks.unshift(task);
    this.setTasks(tasks);
  },
  onUpdateTask: function (taskId, field, newValue, trigger) {
    var tasks = this.get('tasks');
    var len = tasks.length;
    var trigger = trigger || true;

    for (var i=0; i<len; i++) {
  		if (taskId === tasks[i].id) {
  			tasks[i][field] = newValue;
  			break;
  		}
  	}

    this.setTasks(tasks, trigger);
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
    this.set('loaded', false);
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
  setTasks: function (tasks, trigger) {
    _cacheTasks = tasks;
    this.set('tasks', tasks, {trigger: trigger});
  },
  getCachedTasks: function () {
    return _cacheTasks;
  },
  activeTab: function(newValue) {
    this.set('activeTab', newValue)
  },
  onCommentsNum: function(comments) {
    this.set('commentsNumber', comments);
  }
});

module.exports = TasksStore;
