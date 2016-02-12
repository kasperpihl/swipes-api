var React = require('react');
var Reflux = require('reflux');
var Tabs = require('material-ui/lib').Tabs;
var Tab = require('material-ui/lib').Tab;
var ProjectStore = require('../stores/ProjectStore');
var ProjectActions = require('../actions/ProjectActions');
var TaskListItem = require('./task_list_item');

var StatusesList = React.createClass({
	mixins: [ProjectStore.connect()],
	componentWillReceiveProps: function (nextProps) {
		if (this.props.projectKey !== nextProps.projectKey) {
			ProjectActions.fetchData();
		}
	},
	componentDidMount: function () {
		ProjectActions.fetchData();
	},
	renderStatuses: function () {
		var statuses = this.state.statuses;
		var tabs = statuses.map(function (item, index) {
			var issues = item.issues.map(function (item, index) {
				return <TaskListItem key={index} data={item} />
			});

			return <Tab label={item.name} key={index}>
				<div>
					{issues}
				</div>
			</Tab>
		});

		return <Tabs children={tabs}></Tabs>
	},
	renderProjectLink: function () {
		var projectUrl = this.props.projectUrl;
		var textStyles = {
			display: 'inline-block',
			marginTop: '5px',
			fontSize: '14px',
			color: 'rgba(0, 0, 0, 0.498039)'
		};

		return (
			<span style={textStyles}>
				If you want to do something more specific you can go to
				<a href={projectUrl} target="_blank"> JIRA</a>
			</span>
		);
	},
	render: function () {
		return (
			<div>
				{this.state.statuses.length > 0 ? (
					<div>
						{this.renderStatuses()}
						{this.renderProjectLink()}
					</div>
				) : (
					<div>Loading...</div>
				)}
			</div>
		)
	}
});

module.exports = StatusesList;
