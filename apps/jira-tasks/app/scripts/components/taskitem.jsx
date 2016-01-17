var React = require('react');
var Reflux = require('reflux');
var TaskItem = React.createClass({
	render: function() {
		console.log('render', this.props.data);
		return (
			<div className="task-item-container">
				<div className="task-item">
					{this.props.data.fields.summary}
				</div>
			</div>
		);
	}
});


module.exports = TaskItem;