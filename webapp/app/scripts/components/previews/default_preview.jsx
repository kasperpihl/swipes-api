var React = require('react');
var DefaultPreview = React.createClass({

	defaults: {
		title: "Alert",
		buttons: [],

	},
	render: function () {
		// Here is the obj from the search
		// console.log(this.props.data.obj);
		return (
			<div className="default-preview">
				{this.props.data.obj.text}
			</div>
		);
	}
});

module.exports = DefaultPreview;