var React = require('react');
var classNames = require('classnames');
var FontIcon = require('material-ui/lib/font-icon');

var MainStore = require('../stores/MainStore');
var SubtasksStore = require('../stores/SubtasksStore');
var SubtasksActions = require('../actions/SubtasksActions');
var ProjectDataActions = require('../actions/ProjectDataActions');
var Loading = require('./loading');
var AssigneeMenu = require('./assignee_menu');

var Subtasks = React.createClass({
  mixins: [SubtasksStore.connect()],
  componentDidMount: function () {
    var task = this.props.task;
    var optFields = [
  		'name',
  		'assignee',
  		'completed',
  		'due_on',
      'parent'
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
    })

    return elements;
  },
  render: function () {
    var subtasks = this.state.subtasks;

    return (
      <div>
        {subtasks.length > 0 ? (
					<div>
            {this.renderSubtasks()}
					</div>
				) : (
					<Loading />
				)}
      </div>
    )
  }
});

var Subtask = React.createClass({
  completeTask: function (task) {
    ProjectDataActions.completeTask(task);
  },
  undoCompleteTask: function (task) {
    ProjectDataActions.undoCompleteTask(task);
  },
  shareTaskUrl: function (taskUrl) {
    swipes.share.request({url: taskUrl});
  },
  renderCompleteOrUndo: function () {
    var task = this.props.subtask;

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
  render: function () {
    var subtask = this.props.subtask;
    var dotClass = classNames({
      'dot': true,
      'todo': !subtask.completed,
      'done': subtask.completed
    });
    var settings = MainStore.get('settings');
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + subtask.id;


    return (
      <div className="task-wrapper">
        <div className="task">
          <div className="task-list-element">
  					<div className={dotClass}></div>
  				</div>
  				<div className="task-details-wrap">
              <div className="task-title">{subtask.name}</div>
              <div className="task-details">
                  {this.renderCompleteOrUndo()}
                  <div className="main-actions"><FontIcon onClick={this.shareTaskUrl.bind(this, taskUrl)} className="material-icons">share</FontIcon></div>
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
