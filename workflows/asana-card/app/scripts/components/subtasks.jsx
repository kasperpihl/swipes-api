var React = require('react');
var FontIcon = require('material-ui/lib/font-icon');

var MainStore = require('../stores/MainStore');
var SubtasksStore = require('../stores/SubtasksStore');
var SubtasksActions = require('../actions/SubtasksActions');
var ProjectDataActions = require('../actions/ProjectDataActions');
var MainActions = require('../actions/MainActions');
var ProjectsStore = require('../stores/ProjectsStore');
var Loading = require('./loading');
var AssigneeMenu = require('./assignee_menu');
var SwipesDot = require('swipes-dot').default;

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
      };
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
  removeTask: function (task) {
    ProjectDataActions.removeTask(task);
  },
  dotItems: function () {
    var that = this;
    var items = [];
    var task = this.props.subtask;
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
  render: function () {
    var subtask = this.props.subtask;
    var settings = MainStore.get('settings');
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + subtask.id;
    var subtaskId = subtask.id;
    var dotItems = this.dotItems();

    return (
      <div id={subtaskId} className="task-wrapper">
        <div className="task">
          <div className="task-list-element">
            <SwipesDot
              className="dot"
              hoverParentId={subtaskId}
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
                backgroundColor: 'rgba(0, 12, 47, 1)',
                padding: '5px 10px',
                top: '-12px',
                fontSize: '16px',
                letterSpacing: '1px'
              }}
              />
  				</div>
  				<div className="task-details-wrap">
              <Textarea
                ref="subTitle" 
                className="task-title sub-task"
                defaultValue={subtask.name}
                onChange={this.onTitleChange}
                onFocus={this.editSubTitle}
                onBlur={this.saveSubTitle}
                onKeyDown={this.onKeyDown}
                placeholder="No title"
                value={this.state.subtitleInputValue}
                minRows={1}
                maxRows={10}/>
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
