var React = require('react');
var Reflux = require('reflux');
var Loading = require('./loading');
var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');
var TasksStore = require('../stores/TasksStore');
var ProjectDataActions = require('../actions/ProjectDataActions');
var FontIcon = require('material-ui/lib/font-icon');

var ExpandedTask = React.createClass({
  mixins: [TasksStore.connect()],
  renderDescription: function () {
    return (<div>Desciption will be here</div>);
  },
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
          {this.renderDescription()}
          <div className="header-actions">
            {this.renderCompleteOrUndo(task)}
            <div className="header-action" onClick={this.removeTask.bind(this, task)}>
              <FontIcon className="material-icons">delete</FontIcon>
            </div>
            <div className="header-action" onClick={this.shareTaskUrl.bind(this, taskUrl)}>
              <FontIcon className="material-icons">share</FontIcon>
            </div>
            <div className="header-action">
              <FontIcon className="material-icons">link</FontIcon>
            </div>
          </div>
        </div>
        {/* when implementing, use the structure for the api, with checking if is assigned, has image etc */}
        <div className="header-avatar">
          <img src="https://unsplash.it/35/?random" />
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
