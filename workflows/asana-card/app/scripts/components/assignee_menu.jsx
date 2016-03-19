var React = require('react');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var IconButton = require('material-ui/lib/icon-button');
var MenuItem = require('material-ui/lib/menus/menu-item');
var FontIcon = require('material-ui/lib/font-icon');
var UserStore = require('../stores/UserStore');
var ProjectDataActions = require('../actions/ProjectDataActions');

var AssigneeMenu = React.createClass({
  stopPropagation: function (event) {
    event.stopPropagation();
  },
  handleMenuItemClick: function (task, userId) {
    ProjectDataActions.assignPerson(task, userId);
  },
  assignChoices: function() {
    var task = this.props.task;
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
    var task = this.props.task;
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
  render: function () {
    return (
      <div title=""  onClick={this.stopPropagation}>
        {this.assignChoices()}
        {this.renderAssign()}
      </div>
    )
  }
});

module.exports = AssigneeMenu;
