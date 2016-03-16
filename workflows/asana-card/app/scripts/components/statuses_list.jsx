var React = require('react');
var Reflux = require('reflux');
var Tabs = require('material-ui/lib/tabs/tabs');
var Tab = require('material-ui/lib/tabs/tab');
var TasksStore = require('../stores/TasksStore');
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
    overflowY: 'auto'
  },
	inkBarStyle: {
		height: '48px',
		marginTop: '-48px',
		position: 'relative',
		zIndex: '1',
		backgroundColor: '#CCCED5'
	}
};

var matchTasks = function (tasks) {
	var statuses = [
		{name: 'Incomplete', tasks: []},
		{name: 'Completed', tasks: []},
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
		ProjectDataActions.fetchData();
	},
	renderStatuses: function (tasks) {
		var statuses = matchTasks(tasks);
		var tabs = statuses.map(function (item, index) {
			var tasks = item.tasks.map(function (item, index) {
				return <TaskItem key={index} data={item} />
			});

			return <Tab style={tabsStyles.singleTab} label={item.name} key={index}>
				<div className="task-list-wrapper">
					{tasks}
				</div>
			</Tab>
		});

		return <Tabs
			tabItemContainerStyle={{background:'none'}}
			inkBarStyle={tabsStyles.inkBarStyle}
			children={tabs}></Tabs>
	},
	render: function () {
    var tasks = TasksStore.get('tasks');

		return (
			<div>
				{tasks && (tasks.length > 0) ? (
					<div>
						{this.renderStatuses(tasks)}
					</div>
				) : (
					<Loading />
				)}
			</div>
		)
	}
});

module.exports = StatusesList;
