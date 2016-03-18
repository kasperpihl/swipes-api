var React = require('react');
var AssigneeMenu = require('./assignee_menu');
var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');
var ProjectsStore = require('../stores/ProjectsStore');
var ProjectDataActions = require('../actions/ProjectDataActions');
var FontIcon = require('material-ui/lib/font-icon');
var FlatButton = require('material-ui/lib/flat-button');

var TaskItem = React.createClass({
  getInitialState: function(){
	    return {};
	},
  renderCompleteOrUndoHover: function () {
    var task = this.props.data;

    if (task.completed) {
      return (
        <div className="main-actions" onClick={this.undoCompleteTask.bind(this, task)}><FontIcon className="material-icons">undo</FontIcon></div>
      )
    } else {
      return (
        <div className="main-actions" onClick={this.completeTask.bind(this, task)}><FontIcon className="material-icons">check</FontIcon></div>
      )
    }
  },
  completeTask: function (task, event) {
    ProjectDataActions.completeTask(task);
    event.stopPropagation();
  },
  undoCompleteTask: function (task, event) {
    ProjectDataActions.undoCompleteTask(task);
    event.stopPropagation();
  },
  shareTaskUrl: function (taskUrl, event) {
    swipes.share.request({url: taskUrl});
    event.stopPropagation();
  },
  expandTask: function (taskId) {
    MainActions.expandTask(taskId);
  },
  renderProjectName: function (taskProjectName) {
    // Hide project name if it is not the "My tasks" view
    // It does not make sense for the other views because we
    // show only one project for now
    var settings = MainStore.get('settings');
    var projectType = settings.projectType;

    if (taskProjectName && projectType == 'mytasks') {
      return (
        <div className="task-project">{taskProjectName}</div>
      )
    }
  },
  render: function() {
		var task = this.props.data;
		var taskState = task.completed ? 'done' : 'todo';
		var dotColor = "dot " + taskState;
    var settings = MainStore.get('settings');
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + task.id;
    var allProjects = ProjectsStore.getAll();
    var taskProjects = task.projects;
    // We will show only the first one fow now
    var taskProjectId = taskProjects.length > 0 ? taskProjects[0].id : null;
    var taskProject = allProjects[taskProjectId] || {};
    var taskProjectName = taskProject.name || null;

		return (
			<div className="task-wrapper" onClick={this.expandTask.bind(this, task.id)}>
        <div className="task">
          <div className="task-list-element">
  					<div className={dotColor}></div>
  				</div>
  				<div className="task-details-wrap">
  					<div className="task-title">{task.name}</div>
              <div className="task-details">
                {this.renderProjectName(taskProjectName)}
                {this.renderCompleteOrUndoHover()}
                <div className="main-actions"><FontIcon onClick={this.shareTaskUrl.bind(this, taskUrl)} className="material-icons">share</FontIcon></div>
              </div>
  				</div>
          <div className="task-assign-avatar">
            <AssigneeMenu task={task} />
          </div>
        </div>
			</div>
		)
	}
})


module.exports = TaskItem;
