var React = require('react');
var Reflux = require('reflux');
var Tabs = require('material-ui/lib/tabs/tabs');
var Tab = require('material-ui/lib/tabs/tab');
var TasksStore = require('../stores/TasksStore');
var TasksActions = require('../actions/TasksActions');
var ProjectDataStore = require('../stores/ProjectDataStore');
var ProjectDataActions = require('../actions/ProjectDataActions');
var MainStore = require('../stores/MainStore');
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
		height: '30px',
		marginTop: '-30px',
		position: 'relative',
		zIndex: '1',
		backgroundColor: 'white'
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

  statuses[1].tasks.sort(function(a,b) {
    return new Date(b.completed_at) - new Date(a.completed_at)
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
    var elementRect = this._over.getBoundingClientRect();
    var mousePosPercent_Y = ((e.clientY - elementRect.top) / (elementRect.height)) * 100;
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
    // If it 'mytasks' we disable the drag because
    // asana don't support reordering on mytasks list
    var projectType = MainStore.get('settings').projectType;

    if (projectType === 'mytasks') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

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
    var emptyStateText;
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

      if (index === 0) {
        emptyStateText = <p><span className="bold">There are no tasks</span> <br /> Create a new task</p>
      } else if (index === 1) {
        emptyStateText = <p><span className="bold">There are no completed tasks</span> <br /> Complete your first task</p>
      }

      var centerImage = (document.body.scrollHeight / 2) - 40 - 90;

      if (tasks.length < 1) {
        tasks = <div className="empty-state asana" style={{marginTop: centerImage + 'px'}}>
          <img src="./images/emptystate-asana-tasklist.svg" />
          {emptyStateText}
        </div>
      }

      var className = "task-list-wrapper";
      if(tasks.length > 19){
        className += " compact";
      }
      else if(tasks.length > 9){
        className += " semi-compact";
      }

      // if (tab.props.selected === 'true') {
      //   TasksActions.activeTab('active');
      // } else {
      //   TasksActions.activeTab('inactive');
      // }

      return <Tab className={"asana-tab " + that.state.activeTab} ref="asanaTab" style={tabsStyles.singleTab} label={item.name} key={index}>
				<div onDragOver={that.onDragOver} className={className}>
					{tasks}
				</div>
			</Tab>
		});

    return <Tabs className="height-100 tabs-child-selector"
  			tabItemContainerStyle={{background:'#F4F4F5'}}
  			inkBarStyle={tabsStyles.inkBarStyle}
  			children={tabs}></Tabs>
	},
	render: function () {
    var tasks = this.state.tasks;
    var loaded = this.state.loaded;

		return (
			<div className="height-100">
        {loaded === false ? (
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
