var React = require('react');
var AppPreview = React.createClass({
	render: function () {
		return (
			<div className="app-preview">
				app: {this.props.data.obj.text}
			</div>
		);
	}
});

module.exports = AppPreview;