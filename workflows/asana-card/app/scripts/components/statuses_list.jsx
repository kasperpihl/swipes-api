var React = require('react');
var Reflux = require('reflux');
var Tabs = require('material-ui/lib/tabs/tabs');
var Tab = require('material-ui/lib/tabs/tab');
var TasksStore = require('../stores/TasksStore');
var TasksActions = require('../actions/TasksActions');
var ProjectDataStore = require('../stores/ProjectDataStore');
var ProjectDataActions = require('../actions/ProjectDataActions');
var TaskItem = require('./task_list_item');
var Loading = require('./loading');

var tabsStyles = {
  singleTab: {
    backgroundColor: 'transparent',
		color: '#333D59',
		borderBottom: '1px solid #F4F4F5',
		position: 'relative',
		zIndex: '99',
    maxHeight: '100%',
    padding: '0',
    overflowY: 'auto'
  },
	inkBarStyle: {
		height: '40px',
		marginTop: '-40px',
		position: 'relative',
		zIndex: '1',
		backgroundColor: '#F4F4F5'
	}
};

var matchTasks = function (tasks) {
	var statuses = [
		{name: 'Incomplete', tasks: []},
		{name: 'Completed', tasks: []}
	];

  tasks.forEach(function (task) {
    if (task.completed) {
			statuses[1].tasks.push(task);
		} else {
			statuses[0].tasks.push(task);
		}
  })

	return statuses;
}

var StatusesList = React.createClass({
	mixins: [TasksStore.connect()],
	componentWillReceiveProps: function (nextProps) {
		if (this.props.projectId !== nextProps.projectId) {
			ProjectDataActions.fetchData();
		}
	},
	componentDidMount: function () {
    var tasksCache = TasksStore.getCachedTasks();

    if (tasksCache.length > 0) {
      TasksActions.loadTasks(tasksCache);
    } else {
      ProjectDataActions.fetchData();
    }

    this._placeholder = document.createElement("div");
    this._placeholder.className = "drag-placeholder";
	},
  onDragOver: function (e) {
    e.preventDefault();

    this._over = e.target;
    elementRect = this._over.getBoundingClientRect();
    var mousePosPercent_Y = ((e.clientY-elementRect.top) /(elementRect.height))*100;
    var parent = e.target.parentNode;

    if(e.target.className === "drag-placeholder") return;

    if(mousePosPercent_Y > 50) {
      this._dragPlaceholderPlacement = "after";
      parent.insertBefore(this._placeholder, e.target.nextElementSibling);
    }
    else {
      this._dragPlaceholderPlacement = "before"
      parent.insertBefore(this._placeholder, e.target);
    }
  },
  onDragStart: function (e) {
    TasksActions.dragStart();
    this._dragged = e.currentTarget;
  },
  onDragEnd: function (e) {
    var draggedId = this._dragged.getAttribute('id');
    var overId = this._over.getAttribute('id');
    var placement = this._dragPlaceholderPlacement;

    TasksActions.dragEnd();
    ProjectDataActions.reorderTasks(draggedId, overId, placement);
    this._dragged.parentNode.removeChild(this._placeholder);
  },
	renderStatuses: function (tasks) {
    var that = this;
		var statuses = matchTasks(tasks);
		var tabs = statuses.map(function (item, index) {
    var tasks = item.tasks.map(function (item, index) {
      return <TaskItem
        key={index}
        data={item}
        dragging={that.state.dragging}
        onDragStart={that.onDragStart}
        onDragEnd={that.onDragEnd}
        onDragOver={that.onDragOver}
        onDragEnter={that.onDragEnter}
      />
    });

			return <Tab className="asana-tab" style={tabsStyles.singleTab} label={item.name} key={index}>
				<div onDragOver={this.onDragOver} className="task-list-wrapper">
					{tasks}
				</div>
			</Tab>
		});

    if (tasks.length > 0) {
      return <Tabs className="height-100 tabs-child-selector"
  			tabItemContainerStyle={{background:'none'}}
  			inkBarStyle={tabsStyles.inkBarStyle}
  			children={tabs}></Tabs>
    } else {
      <div className="empty-state asana">
        <img src="./images/swipes-ui-workspace-emptystate-task.svg" />
        <p>No tasks yet. <br /> Why don't you get this party poppin?</p>
      </div>
    }
	},
	render: function () {
    var tasks = this.state.tasks;

		return (
			<div className="height-100">
        {tasks === null ? (
          <Loading />
				) : (
          <div>
            <div className="height-100">
  						{this.renderStatuses(tasks)}
  					</div>
					</div>
				)}
			</div>
		)
	}
});

module.exports = StatusesList;
