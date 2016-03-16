var React = require('react');
var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');
var UserStore = require('../stores/UserStore');
var ProjectsStore = require('../stores/ProjectsStore');
var ProjectDataActions = require('../actions/ProjectDataActions');
var FontIcon = require('material-ui/lib/font-icon');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var IconButton = require('material-ui/lib/icon-button');
var MenuItem = require('material-ui/lib/menus/menu-item');
var FlatButton = require('material-ui/lib/flat-button');

var TaskItem = React.createClass({
  getInitialState: function(){
	    return {};
	},
  handleMenuItemClick: function (task, userId) {
    ProjectDataActions.assignPerson(task, userId);
  },
  assignChoices: function() {
    var task = this.props.data;
    var allUsers = UserStore.getAll();
    var assigneeId = task.assignee ? task.assignee.id : null;
    var userSize = Object.keys(allUsers).length;

    if (userSize > 0) {
      if (!assigneeId) {

        return (
          <div className="assign-layer">
            <div className="task-assign" title="Assign to a person">
              <FontIcon className="material-icons">person_add</FontIcon>
            </div>
          </div>
        )

      } else if (assigneeId && !allUsers[assigneeId].photo) {
          var name = allUsers[assigneeId].name;
          var matches = name.match(/\b(\w)/g);
          var acronym = matches.join('');

          return (
            <div className="assign-layer">
              <div className="avatar-name">{acronym}</div>
            </div>
          )
      } else {
        var image = allUsers[assigneeId].photo.image_36x36;

        return (
          <div className="assign-layer">
            <img src={image} />
          </div>
        )
      }
    }
  },
  renderAssign: function() {
    var task = this.props.data;
    var allUsers = UserStore.getAll();
    var userSize = Object.keys(allUsers).length;

    if (userSize <= 0) {
      return;
    }


    var names = [];
    for (var prop in allUsers) {
       names.push(<MenuItem key={prop} primaryText={allUsers[prop].name} onClick={this.handleMenuItemClick.bind(this, task, allUsers[prop].id)} />)
    }
    return (
      <IconMenu
      iconButtonElement={<IconButton><FontIcon className="material-icons inv-icon">person_add</FontIcon></IconButton>}
      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
      maxHeight={250}
      >
      {names}
      </IconMenu>
    )
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
  stopPropagation: function (event) {
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
    if (taskProjectName) {
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

          <div className="task-assign-avatar" title=""  onClick={this.stopPropagation}>
            {this.assignChoices()}
            {this.renderAssign()}
            {/* if has not been assigned yet substitute img tag with
              <div className="action-bar-assign" title="Assign to a person">
                <FontIcon className="material-icons">person_add</FontIcon>
              </div>
              <img src="https://unsplash.it/35/?random"/>
              and if no image then <div class="avatar-name"></div>
            */}
          </div>
        </div>
			</div>
		)
	}
})


module.exports = TaskItem;
