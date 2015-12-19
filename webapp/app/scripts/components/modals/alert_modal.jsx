var React = require('react');
var AlertModal = React.createClass({
	defaults: {
		title: "Alert",
		buttons: [],

	},
	render: function () {
		var options = this.props.data.options;
		console.log(options);

		var title = options.title || this.defaults.title;
		var buttons = options.buttons || this.defaults.buttons;
		return (
			<div className="modal-full">
				<h1>{title}</h1>
				<div className="button-group">
					{buttons}
				</div>
			</div>
		);
	}
});
AlertModal.Button = React.createClass({
	render: function(){
		return (
			<div className="button"></div>
		);
	}
})

module.exports = AlertModal;