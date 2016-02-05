var React = require('react');
var AppBar = require('material-ui/lib').AppBar;
var Colors = require('material-ui/lib/styles/colors');
var FontIcon = require('material-ui/lib/font-icon');
var TaskListItem = require('./task_list_item');

var StatusCard = React.createClass({
	getInitialState: function () {
		return {
			expanded: false,
			rightIconClass: 'keyboard-arrow-down'
		}
	},
	handleClick: function () {
		var expanded = !this.state.expanded

		this.setState({
			expanded: expanded,
			rightIconClass: expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
		})
	},
	renderExpanded: function () {
		if (this.state.expanded) {
			var elements = this.props.issues.map(function (item, index) {
				return (
					<TaskListItem key={index} data={item} />
				)
			});

			return elements;
		}
	},
	render: function () {
		//console.log(this.props);
		return (
			<div>
				<AppBar
					title={this.props.name}
					showMenuIconButton={false}
					onRightIconButtonTouchTap={this.handleClick}
					onTitleTouchTap={this.handleClick}
					iconClassNameRight={'material-icons ' + this.state.rightIconClass}
					style={{
						backgroundColor: Colors.indigo500
					}}
				/>
				<div>
					{this.renderExpanded()}
				</div>
			</div>
		)
	}
});

module.exports = StatusCard;
