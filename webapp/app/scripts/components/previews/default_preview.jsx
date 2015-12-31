var React = require('react');
var DefaultPreview = React.createClass({
	render: function () {
		return (
			<div className="default-preview">
				default: {this.props.data.obj.text}
			</div>
		);
	}
});

module.exports = DefaultPreview;