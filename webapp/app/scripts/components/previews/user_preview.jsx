var React = require('react');
var UserPreview = React.createClass({
	render: function () {
		return (
			<div className="user-preview">
				user: {this.props.data.obj.text}
			</div>
		);
	}
});

module.exports = UserPreview;