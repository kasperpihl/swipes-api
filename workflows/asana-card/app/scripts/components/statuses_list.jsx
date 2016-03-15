var React = require('react');
var Reflux = require('reflux');
var Tabs = require('material-ui/lib/tabs/tabs');
var Tab = require('material-ui/lib/tabs/tab');
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

var StatusesList = React.createClass({
	mixins: [ProjectDataStore.connect()],
	componentWillReceiveProps: function (nextProps) {
		if (this.props.projectId !== nextProps.projectId) {
			ProjectDataActions.fetchData();
		}
	},
	componentDidMount: function () {
		ProjectDataActions.fetchData();
	},
	renderStatuses: function () {
		var statuses = this.state.statuses;
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
	// renderProjectLink: function () {
	// 	var projectUrl = this.props.projectUrl;
	// 	var textStyles = {
	// 		display: 'inline-block',
	// 		marginTop: '5px',
	// 		fontSize: '14px',
	// 		color: 'rgba(0, 0, 0, 0.498039)'
	// 	};
	//
	// 	return (
	// 		<span style={textStyles}>
	// 			If you want to do something more specific you can go to
	// 			<a href={projectUrl} target="_blank"> JIRA</a>
	// 		</span>
	// 	);
	// },
	render: function () {
		return (
			<div>
				{this.state.statuses.length > 0 ? (
					<div>
						{this.renderStatuses()}
					</div>
				) : (
					<Loading />
				)}
			</div>
		)
	}
});

module.exports = StatusesList;
