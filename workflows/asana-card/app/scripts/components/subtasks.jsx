var React = require('react');
var FontIcon = require('material-ui/lib/font-icon');

var SubtasksStore = require('../stores/SubtasksStore');
var SubtasksActions = require('../actions/SubtasksActions');
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
  render: function () {
    var subtask = this.props.subtask;

    return (
      <div className="task-wrapper">
        <div className="task">
          <div className="task-list-element">
  					<div className="sub-dot"></div>
  				</div>
  				<div className="task-details-wrap">
              <div className="task-title">{subtask.name}</div>
              <div className="task-details">
                  <div className="main-actions"><FontIcon className="material-icons">check</FontIcon></div>
                  <div className="main-actions"><FontIcon className="material-icons">share</FontIcon></div>
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
