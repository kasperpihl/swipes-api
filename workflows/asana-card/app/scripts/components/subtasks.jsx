var React = require('react');
var FontIcon = require('material-ui/lib/font-icon');

var MainStore = require('../stores/MainStore');
var SubtasksStore = require('../stores/SubtasksStore');
var SubtasksActions = require('../actions/SubtasksActions');
var ProjectDataActions = require('../actions/ProjectDataActions');
var ProjectDataStore = require('../stores/ProjectDataStore');
var MainActions = require('../actions/MainActions');
var ProjectsStore = require('../stores/ProjectsStore');
var Loading = require('./loading');
var AssigneeMenu = require('./assignee_menu');
var SwipesDot = require('swipes-dot').default;
var moment = require('moment');

var Textarea = require('react-textarea-autosize');

var Subtasks = React.createClass({
  mixins: [SubtasksStore.connect()],
  componentDidMount: function () {
    var task = this.props.task;
    var optFields = [
  		'name',
  		'assignee',
  		'completed',
  		'due_on',
      'due_at',
      'parent',
      'created_at'
  	];

    swipes.service('asana').request('tasks.subtasks', {
      id: task.id,
      opt_fields: optFields.join(',')
    })
    .then(function (res) {
      var subtasks = res.data;

      SubtasksActions.load(subtasks);
    })
    .catch(function (err) {
      console.log(err);
    })
  },
  renderSubtasks: function () {
    var subtasks = this.state.subtasks;
    var elements = [];

    subtasks.forEach(function (subtask) {
      elements.push(<Subtask key={subtask.id} subtask={subtask} />);
    });
    // TODO dynamic links
    if (elements.length > 0) {
      return elements;
    } else {
      return (
        <div className="empty-state asana" style={{marginTop: '10%'}}>
          <img src="./images/emptystate-asana-subtasks.svg" />
          <p><span className="bold">There are no subtasks</span> <br /> Create a new subtask</p>
        </div>
      )
    }
  },
  render: function () {
    var subtasks = this.state.subtasks;

    return (
      <div>
        {subtasks === null ? (
          <Loading style={{marginTop: '20%'}} />
				) : (
          <div>
            {this.renderSubtasks()}
					</div>
				)}
      </div>
    )
  }
});

var Subtask = React.createClass({
  getInitialState:function() {
      return {
        story: []
      };
  },
  componentDidMount: function () {
    var subtask = this.props.subtask;
    var storyPromise = swipes.service('asana').request('stories.findByTask', {
      id: subtask.id
    }).then(function(story) {
      SubTaskActions.addCreatedAt(story);
    })
  },
  completeTask: function (task) {
    ProjectDataActions.completeTask(task);
  },
  undoCompleteTask: function (task) {
    ProjectDataActions.undoCompleteTask(task);
  },
  shareTaskUrl: function (taskUrl) {
    swipes.share.request({url: taskUrl});
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
  removeTask: function (task) {
    ProjectDataActions.removeTask(task);
  },
  scheduleTask: function(task, taskId) {
    ProjectDataActions.scheduleTask(task, taskId);
  },
  dotItems: function () {
    var that = this;
    var items = [];
    var firstRow = [];
    var secondRow = [];
    var task = this.props.subtask;
    var settings = MainStore.get('settings');
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + task.id;

    if (task.completed) {
      firstRow.push({
        label: 'Undo',
        icon: 'undo',
        bgColor: 'rgb(56,182,131)',
        callback: function () {
          that.undoCompleteTask(task);
        }
      });
    } else {
      firstRow.push({
        label: 'Complete',
        icon: 'check',
        bgColor: 'rgb(56,182,131)',
        callback: function () {
          that.completeTask(task);
        }
      });
    }

    firstRow.push({
      label: 'Schedule task',
      icon: 'schedule',
      bgColor: 'rgb(26,168,252)',
      callback: function () {
        that.scheduleTask(task, task.id);
      }
    })

    firstRow.push({
      label: 'Remove',
      icon: 'delete',
      bgColor: 'rgb(252,58,28)',
      callback: function () {
        that.removeTask(task);
      }
    });

    secondRow.push({
      label: 'Share section',
      icon: 'share',
      bgColor: 'rgb(255,197,37)',
      callback: function () {
        that.shareTaskUrl(taskUrl);
      }
    });

    secondRow.push({
      label: 'Jump to asana',
      icon: 'link',
      bgColor: 'rgb(255,197,37)',
      callback: function () {
        window.open(taskUrl, '_blank');
      }
    });

    items.push(firstRow);
    items.push(secondRow);

    return items;
  },
  saveSubTitle: function() {
    var newTitle = this.refs.subTitle.value;
    var taskId = this.props.subtask.id;

    this.setState({editingSubTitleState: 'inactive'});

    swipes.service('asana').request('tasks.update', {
      id: taskId,
      name: newTitle
    })
    // TODO handle errors
  },
  editSubTitle: function() {
    this.setState({editingSubTitleState: 'active'});
  },
  onTitleChange: function(event){
    this.setState({subtitleInputValue: event.target.value});
  },
  onKeyDown: function(e){
    if(e.keyCode === 13 || e.keyCode === 27){
      this.refs.subTitle.blur();
    }
  },
  renderTextarea: function () {
    var subtask = this.props.subtask;
    var subtaskCompletedState = 'inactive';
    if (!subtask.completed) {
    } else {
      subtaskCompletedState = 'active';
    }
    return (
      <Textarea
        ref="subTitle"
        className={"task-title sub-task " + subtaskCompletedState}
        defaultValue={subtask.name}
        onChange={this.onTitleChange}
        onFocus={this.editSubTitle}
        onBlur={this.saveSubTitle}
        onKeyDown={this.onKeyDown}
        placeholder="No title"
        value={this.state.subtitleInputValue}
        minRows={1}
        maxRows={10}/>
    )
  },
  removeScheduling: function() {
    var subtask = this.props.subtask;
    ProjectDataActions.removeScheduling(subtask);
  },
  renderDueOnDate: function() {
    var task = this.props.subtask;
    var dueOnText;

    if (task.due_on || task.due_at) {
      var taskDue;
      var parsedTime;
      var farTimeParsed = '';
      taskDue = task.due_on;
      var parseDate = ProjectDataStore.getDueDate(taskDue);

      if (parseDate.farDays === true) {
        var farTime;

        if (task.due_at) {
          farTime = task.due_at;
        } else {
          farTime = task.due_on;
        }

        farTimeParsed = 'Due on ' + moment(farTime).format('Do MMM YYYY, hh:mma');
        parseDate.timeString = '';
      } else {
        if (task.due_at) {
          var timeToAdd = moment(task.due_at).format('hh:mma')
          parseDate.timeString = parseDate.timeString + timeToAdd;
        }
      }

      return (
        <div className={"task-due-on subtask " + parseDate.color}>
          {parseDate.timeString + farTimeParsed}
          <div className="remove-schedule" onClick={this.removeScheduling}>
            <i className="material-icons">close</i>
          </div>
        </div>
      )
    }
  },
  onDotDragStart: function(){
    var subtask = this.props.subtask;
    var settings = MainStore.get('settings');
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + subtask.id;
    swipes.dot.startDrag(this.shareData(taskUrl));
  },
  render: function () {
    var subtask = this.props.subtask;
    var settings = MainStore.get('settings');
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + subtask.id;
    var subtaskId = subtask.id;
    var dotItems = this.dotItems();
    var time = moment(subtask.created_at).format("h:mm a, d MMM YYYY");

    return (
      <div id={subtaskId} className="task-wrapper">
        <div className="task">
          <div className="task-list-element">
            <SwipesDot
              className="dot"
              hoverParentId={subtaskId}
              elements={dotItems}
              onDragStart={this.onDotDragStart}
              />
  				</div>
  				<div className="task-details-wrap">
            {this.renderTextarea()}
            <div className="details">
              {this.renderDueOnDate()}
            </div>
  				</div>


          <div className="task-assign-avatar" title="">
            <AssigneeMenu task={subtask} />
          </div>
        </div>
			</div>
    )
  }
});

module.exports = Subtasks;
