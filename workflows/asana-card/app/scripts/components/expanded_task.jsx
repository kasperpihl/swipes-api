var React = require('react');
var Reflux = require('reflux');
var FontIcon = require('material-ui/lib/font-icon');
var Loading = require('./loading');
var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');
var TasksStore = require('../stores/TasksStore');
var TaskStore = require('../stores/TaskStore');
var TaskActions = require('../actions/TaskActions');
var ProjectDataActions = require('../actions/ProjectDataActions');
var AssigneeMenu = require('./assignee_menu');

var MAX_DESC_LEN = 140;

var ExpandedTask = React.createClass({
  mixins: [TasksStore.connect(), TaskStore.connect()],
  goBack: function () {
    MainActions.closeExpandedTask();
  },
  shareTaskUrl: function (taskUrl) {
    swipes.share.request({url: taskUrl});
  },
  removeTask: function (task) {
    ProjectDataActions.removeTask(task);
    MainActions.closeExpandedTask();
  },
  completeTask: function (task) {
    ProjectDataActions.completeTask(task);
  },
  undoCompleteTask: function (task) {
    ProjectDataActions.undoCompleteTask(task);
  },
  renderCompleteOrUndo: function (task) {
    if (task.completed) {
      return (
        <div className="header-action" onClick={this.undoCompleteTask.bind(this, task)}>
          <FontIcon className="material-icons">undo</FontIcon>
        </div>
      )
    } else {
      return (
        <div className="header-action" onClick={this.completeTask.bind(this, task)}>
          <FontIcon className="material-icons">check</FontIcon>
        </div>
      )
    }
  },
  expandDescription: function () {
    TaskActions.expandDesc(!this.state.expandDesc);
  },
  renderDescription: function (task) {
    var description = task.notes;

    if (description.length > MAX_DESC_LEN && !this.state.expandDesc) {
      description = description.substring(0,140) + '...';
    }

    return (
      <div className="header-description" ref="desci" onClick={this.expandDescription}>{description}</div>
    );
  },
  renderHeader: function(task) {
    var settings = MainStore.get('settings');
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + task.id;

    return (
      <div className="header-wrapper">
        <div className="back-arrow" onClick={this.goBack}>
          <FontIcon className="material-icons">keyboard_arrow_left</FontIcon>
        </div>
        <div className="header-details">
          <div className="header-title">{task.name}</div>
          {this.renderDescription(task)}
          <div className="header-actions">
            {this.renderCompleteOrUndo(task)}
            <div className="header-action" onClick={this.removeTask.bind(this, task)}>
              <FontIcon className="material-icons">delete</FontIcon>
            </div>
            <div className="header-action" onClick={this.shareTaskUrl.bind(this, taskUrl)}>
              <FontIcon className="material-icons">share</FontIcon>
            </div>
            <a className="header-action" target="_blank" href={taskUrl}>
              <FontIcon className="material-icons">link</FontIcon>
            </a>
          </div>
        </div>
        {/* when implementing, use the structure for the api, with checking if is assigned, has image etc */}
        <div className="header-avatar">
          <AssigneeMenu task={task} />
        </div>
      </div>
    )
  },
  render: function () {
    var tasks = TasksStore.get('tasks');
    var taskId = this.props.taskId;
    var task = tasks.filter(function (task) {
      return task.id === taskId;
    })[0]

    return (
      <div>
        <div>{this.renderHeader(task)}</div>
      </div>
    )
  }
});

module.exports = ExpandedTask;
