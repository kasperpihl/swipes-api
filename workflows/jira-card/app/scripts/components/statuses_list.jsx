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
			ProjectActions.fetchData({projectKey: nextProps.projectKey});
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
	render: function () {
		return (
			<div>
				{this.state.statuses.length > 0 ? (
					<div>{this.renderStatuses()}</div>
				) : (
					<div>Loading...</div>
				)}
			</div>
		)
	}
});

module.exports = StatusesList;
