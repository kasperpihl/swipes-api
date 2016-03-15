var React = require('react');
var MainStore = require('../stores/MainStore');
var UserStore = require('../stores/UserStore');
var ProjectActions = require('../actions/ProjectActions');
var FontIcon = require('material-ui/lib/font-icon');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var IconButton = require('material-ui/lib/icon-button');
var MenuItem = require('material-ui/lib/menus/menu-item');
var FlatButton = require('material-ui/lib/flat-button');

var TaskItem = React.createClass({
  getInitialState: function(){
	    return {
        actionBar: 'inactive'
	    };
	},
  activate: function() {

    if (this.state.actionBar == 'inactive') {
        this.setState({actionBar: 'active'});
    } else {
        this.setState({actionBar: 'inactive'});
    }
  },
  handleMenuItemClick: function (task, userId) {
    ProjectActions.assignPerson(task, userId);
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
  renderCompleteOrUndo: function () {
    var task = this.props.data;

    if (task.completed) {
      return (
        <FlatButton onClick={this.undoCompleteTask.bind(this, task)} style={{width: '100%', height: '100%'}}
          icon={<FontIcon className="material-icons action-button">undo</FontIcon>}
        />
      )
    } else {
      return (
        <FlatButton onClick={this.completeTask.bind(this, task)} rippleColor="green" style={{width: '100%', height: '100%'}}
          icon={<FontIcon className="material-icons action-button">check</FontIcon>}
        />
      )
    }
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
  completeTask: function (task) {
    ProjectActions.completeTask(task);
    this.replaceState(this.getInitialState());
  },
  undoCompleteTask: function (task) {
    ProjectActions.undoCompleteTask(task);
    this.replaceState(this.getInitialState());
  },
  removeTask: function (task) {
    ProjectActions.removeTask(task);
    this.replaceState(this.getInitialState());
  },
  stopPropagation: function (event) {
    event.stopPropagation();
  },
  shareTaskUrl: function (taskUrl) {
    swipes.share.request({url: taskUrl});
  },
  render: function() {
		var task = this.props.data;
		var taskState = task.completed ? 'done' : 'todo';
		var dotColor = "dot " + taskState;
    var settings = MainStore.get('settings');
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + task.id;

		return (
			<div className="task-wrapper">
        <div className="task" onClick={this.activate}>
          <div className="task-list-element">
  					<div className={dotColor}></div>
  				</div>
  				<div className="task-details-wrap">
  					<div className="task-title">{task.name}</div>
              <div className="task-details">
                <div className="task-project">Project name</div>
                {this.renderCompleteOrUndoHover()}
                <div className="main-actions"><FontIcon className="material-icons">share</FontIcon></div>
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

        <div className={"task-action-bars " + this.state.actionBar}>
          <div className="shadow-box"></div>
            <div className="task-actions">
              {this.renderCompleteOrUndo()}
              <FlatButton onClick={this.removeTask.bind(this, task)} rippleColor="red" style={{width: '100%', height: '100%'}}
                icon={<FontIcon className="material-icons action-button">delete</FontIcon>}
              />
            <FlatButton className="link-action-button" target="_blank" linkButton={true} href={taskUrl} style={{width: '100%', height: '100%'}}
                icon={<FontIcon className="material-icons action-button">link</FontIcon>}
              />
              <FlatButton onClick={this.shareTaskUrl.bind(this, taskUrl)} style={{width: '100%', height: '100%'}}
                icon={<FontIcon className="material-icons action-button">share</FontIcon>}
              />
            </div>
        </div>
			</div>
		)
	}
})


module.exports = TaskItem;
