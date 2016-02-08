var React = require('react');
var Reflux = require('reflux');
var MainStore = require('../stores/MainStore');
var ProjectStore = require('../stores/ProjectStore');
var ProjectActions = require('../actions/ProjectActions');
var StatusCard = require('./status_card');

var StatusesList = React.createClass({
	mixins: [ProjectStore.connect()],
	getInitialState: function () {
		return {
			statuses: []
		}
	},
	componentWillReceiveProps: function (nextProps) {
		if (this.props.projectKey !== nextProps.projectKey) {
			ProjectActions.fetchData();
		}
	},
	renderStatuses: function () {
		var statuses = this.state.statuses;
		var elements = statuses.map(function (item, index) {
			return <StatusCard
								key={index}
								id={item.id}
								name={item.name}
								issues={item.issues}
							/>
		});

		return elements;
	},
	renderProjectLink: function () {
		var projectKey = this.props.projectKey;
		var textStyles = {
			display: 'inline-block',
			marginTop: '5px',
			fontSize: '14px',
			color: 'rgba(0, 0, 0, 0.498039)'
		};
		var href = 'https://swipes.atlassian.net/secure/RapidBoard.jspa?rapidView=1&projectKey=' + projectKey;

		return (
			<span style={textStyles}>
				If you want to create new item you can go to
				<a href={href} target="_blank"> JIRA</a>
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
