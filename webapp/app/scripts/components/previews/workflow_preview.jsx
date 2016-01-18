var React = require('react');
var WorkflowPreview = React.createClass({
	render: function () {
		return (
			<div className="workflow-preview">
				workflow: {this.props.data.obj.text}
			</div>
		);
	}
});

module.exports = WorkflowPreview;