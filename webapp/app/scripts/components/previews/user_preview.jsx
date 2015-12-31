var React = require('react');
var UserPreview = React.createClass({
	render: function () {
		return (
			<div className="user-preview">
				<img src={this.props.data.obj.image} />
				<br />
				user: {this.props.data.obj.text}
				<br />
				fullname: {this.props.data.obj.fullname}
				<br />
				position: {this.props.data.obj.position}
			</div>
		);
	}
});

module.exports = UserPreview;
