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
var Subtasks = require('./subtasks');
var SwipesDot = require('swipes-dot').default;

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
  dotItems: function (task) {
    var that = this;
    var items = [];
    //var task = this.props.task;
    var settings = MainStore.get('settings');
    //var taskId = this.props.taskId;
    //var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + taskId;

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
        label: 'Share the task',
        icon: 'share',
        callback: function () {
          //that.shareTaskUrl(taskUrl);
        }
      },
      {
        label: 'Jump to asana',
        icon: 'link',
        callback: function () {
          //window.open(taskUrl, '_blank');
        }
      }
    ]);

    return items;
  },
  saveDescripton: function() {
    var newDescription = this.refs.desci.textContent;
    var taskId = this.props.taskId;

    this.setState({descEditingState: 'inactive'});

    swipes.service('asana').request('tasks.update', {
      id: taskId,
      notes: newDescription
    })
    // TODO handle errors
  },
  saveTitle: function() {
    var newTitle = this.refs.headerTitle.textContent;
    var taskId = this.props.taskId;

    this.setState({titleEditingState: 'inactive'});

    swipes.service('asana').request('tasks.update', {
      id: taskId,
      name: newTitle
    })
    // TODO handle errors
  },
  renderExpander: function(description) {

    if (description && description.length > 0 && description.length > 140) {
      return (
        <div className="expand-description" onClick={this.expandDescription}>
          <FontIcon className="material-icons">{this.state.expandedState}</FontIcon>
        </div>
      )
    } else {
    }
  },
  expandDescription: function () {
    TaskActions.expandDesc(!this.state.expandDesc);
    if (!this.state.expandDesc) {
      this.setState({expandedState: 'keyboard_arrow_up'})
    } else {
      this.setState({expandedState: 'keyboard_arrow_down'})
    }
  },
  expandDescriptionOnFocus: function() {
    TaskActions.expandDesc(true);
    this.setState({expandedState: 'keyboard_arrow_up'});
  },
  renderDescription: function (task) {
    var description = task.notes;

    if (description.length > MAX_DESC_LEN && !this.state.expandDesc) {
      description = description.substring(0,140) + '...';
    } else if (!description.length) {
      description = "No description"
    }

    return (
      <div className="header-description" onFocus={this.expandDescriptionOnFocus} onBlur={this.saveDescripton}>
        <div className="content-editable-wrapper" ref="desci" contentEditable="true">
          {description}
        </div>
        {this.renderExpander(description)}
      </div>
    );
  },
  renderHeader: function(task) {
    var settings = MainStore.get('settings');
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + task.id;
    var taskId = this.props.taskId;
    var dotItems = this.dotItems(task);

    return (
      <div id={taskId} className="header-wrapper">
        <div className="back-arrow" onClick={this.goBack}>
          <FontIcon className="material-icons">keyboard_arrow_left</FontIcon>
        </div>
        <div className="header-details">
          <div className="header-title" ref="headerTitle" contentEditable="true" onBlur={this.saveTitle}>{task.name}</div>
          {this.renderDescription(task)}
        </div>
        {/* when implementing, use the structure for the api, with checking if is assigned, has image etc */}
        <div className="header-avatar">
            <AssigneeMenu task={task} />
        </div>

        <div className="header-dot-wrapper">
          <SwipesDot
            reverse="true"
            className="dot"
            hoverParentId={taskId}
            elements={dotItems}
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
              backgroundColor: 'rgba(0, 12, 47, .8)',
              padding: '5px 10px',
              top: '-12px',
              fontSize: '16px',
              letterSpacing: '1px'
            }}
          />
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
        {this.renderHeader(task)}
        <Subtasks task={task} />
      </div>
    )
  }
});

module.exports = ExpandedTask;
