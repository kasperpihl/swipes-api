var React = require('react');
var UserPreview = React.createClass({

	defaults: {
		title: "Alert",
		buttons: [],

	},
	render: function () {
		// Here is the obj from the search
		console.log(this.props.data.obj);
		return (
			<div className="user-preview">
				{this.props.data.obj.text}
			</div>
		);
	}
});

module.exports = UserPreview;