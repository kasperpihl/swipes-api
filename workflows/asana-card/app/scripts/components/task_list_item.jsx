var React = require('react');
var FontIcon = require('material-ui/lib/font-icon');
var FlatButton = require('material-ui/lib/flat-button');
var SwipesDot = require('swipes-dot').default;
var AssigneeMenu = require('./assignee_menu');
var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');
var ProjectsStore = require('../stores/ProjectsStore');
var ProjectDataActions = require('../actions/ProjectDataActions');
var moment = require('moment');

var TaskItem = React.createClass({
  getInitialState: function(){
	    return {};
	},
  completeTask: function (task) {
    ProjectDataActions.completeTask(task);
  },
  undoCompleteTask: function (task) {
    ProjectDataActions.undoCompleteTask(task);
  },
  removeTask: function (task) {
    ProjectDataActions.removeTask(task);
  },
  shareTaskUrl: function (taskUrl) {
    var shareData = this.shareData(taskUrl);

    swipes.share.request(shareData);
  },
  shareData: function (taskUrl) {
    return {
      url: taskUrl
    }
  },
  scheduleTask: function(taskId) {
    ProjectDataActions.scheduleTask(taskId);
  },
  expandTask: function (taskId) {
    MainActions.expandTask(taskId);
  },
  dotItems: function () {
    var that = this;
    var items = [];
    var task = this.props.data;
    var settings = MainStore.get('settings');
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + task.id;

    if (task.completed) {
      items.push({
        label: 'Undo',
        icon: 'undo',
        callback: function () {
          that.undoCompleteTask(task);
        }
      })
    } else {
      items.push({
        label: 'Complete',
        icon: 'check',
        callback: function () {
          that.completeTask(task);
        }
      })
    }

    items = items.concat([
      {
        label: 'Remove',
        icon: 'delete',
        callback: function () {
          that.removeTask(task);
        }
      },
      {
        label: 'Schedule task',
        icon: 'schedule',
        callback: function() {
          that.scheduleTask(task.id);
        }
      },
      {
        label: 'Share the task',
        icon: 'share',
        callback: function () {
          that.shareTaskUrl(taskUrl);
        }
      },
      {
        label: 'Jump to asana',
        icon: 'link',
        callback: function () {
          window.open(taskUrl, '_blank');
        }
      }
    ]);

    return items;
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
  renderDueOnDate: function() {
    var task = this.props.data;

    var dueOnText;


    if (!task.due_at) {
      console.log('render nothing')
    } else {
      console.log('render something' + task.name);
      var taskDue = task.due_at;
      var parseDate = moment(taskDue).format('hh:mma, Do MMMM YYYY');
      return (
        <div className="task-due-on">{'The task is due on ' + parseDate}</div>
      )
    }
  },
  render: function() {
		var task = this.props.data;
    var taskId = task.id;
    var allProjects = ProjectsStore.getAll();
    var taskProjects = task.projects;
    // We will show only the first one fow now
    var taskProjectId = taskProjects.length > 0 ? taskProjects[0].id : null;
    var taskProject = allProjects[taskProjectId] || {};
    var taskProjectName = taskProject.name || null;
    var settings = MainStore.get('settings');
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + task.id;
    var dotItems = this.dotItems();
    var taskClass = this.props.dragging ? 'task dragging' : 'task';

		return (
			<div
        draggable={true}
        onDragStart={this.props.onDragStart}
        onDragEnd={this.props.onDragEnd}
        onDragOver={this.props.onDragOver}
        onDragEnter={this.props.onDragEnter}
        id={taskId}
        className="task-wrapper"
        onClick={this.expandTask.bind(this, taskId)}
      >
        <div className={taskClass}>
          <div className="task-list-element">
            <SwipesDot
              className="dot"
              hoverParentId={taskId}
              elements={dotItems}
              onDragData={this.shareData.bind(this, taskUrl)}
              menuColors={{
                borderColor: 'transparent',
                hoverBorderColor: '#1DB1FC',
                backgroundColor: '#1DB1FC',
                hoverBackgroundColor: 'white',
                iconColor: 'white',
                hoverIconColor: '#1DB1FC'
              }}
              labelStyles={{
                transition: '.1s',
                boxShadow: 'none',
                backgroundColor: 'rgba(0, 12, 47, 1)',
                padding: '5px 10px',
                top: '-12px',
                fontSize: '16px',
                letterSpacing: '1px',
                zIndex: '99'
              }}
            />
  				</div>
  				<div className="task-details-wrap">
  					<div className="task-title">{task.name}</div>
            {this.renderDueOnDate()}
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
