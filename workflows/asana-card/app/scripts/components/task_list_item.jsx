var React = require('react');
// var Reflux = require('reflux');
// var Paper = require('material-ui/lib').Paper;
// var Avatar = require('material-ui/lib').Avatar;
// var IconMenu = require('material-ui/lib').IconMenu;
// var IconButton = require('material-ui/lib').IconButton;
// var MenuItem = require('material-ui/lib').MenuItem;
// var Colors = require('material-ui/lib/styles/colors');
var UserStore = require('../stores/UserStore');
// var MainActions = require('../actions/MainActions');
var ProjectActions = require('../actions/ProjectActions');
var FontIcon = require('material-ui/lib/font-icon');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var IconButton = require('material-ui/lib/icon-button');
var MenuItem = require('material-ui/lib/menus/menu-item');

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

    if (!task.assignee) {

      return (
        <div className="assign-layer">
          <div className="task-assign" title="Assign to a person">
            <FontIcon className="material-icons">person_add</FontIcon>
          </div>
        </div>
      )

    } else {

      if (!allUsers[task.assignee.id].photo) {
        var name = allUsers[task.assignee.id].name;
        var matches = name.match(/\b(\w)/g);
        var acronym = matches.join('');

        return (
          <div className="assign-layer">
            <div className="avatar-name">{acronym}</div>
          </div>
        )
      } else {
        var image = allUsers[task.assignee.id].photo.image_36x36;

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
  completeTask: function (task) {
    ProjectActions.completeTask(task);
  },
  stopPropagation: function (event) {
    event.stopPropagation();
  },
	render: function() {
		var task = this.props.data;
		var taskState = task.completed ? 'done' : 'todo';
		var dotColor = "dot " + taskState;

		return (
			<div className="task-wrapper">
        <div className="task" onClick={this.activate}>
          <div className="task-list-element">
  					<div className={dotColor}></div>
  				</div>
  				<div className="task-details-wrap">
  					<div className="task-title">{task.name}</div>
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
              <div className="task-action-icon" onClick={this.completeTask.bind(this, task)}>
                <FontIcon className="material-icons">check</FontIcon>
              </div>
              <div className="task-action-icon">
                <FontIcon className="material-icons">link</FontIcon>
              </div>
            </div>
        </div>
			</div>
		)
	}
})


module.exports = TaskItem;
