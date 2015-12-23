var React = require('react');
var AlertModal = React.createClass({
	didClickButton: function(button){
		console.log("clicked button", button);
		this.props.data.callback({button: button});
	},
	defaults: {
		title: "Alert",
		buttons: [],

	},
	render: function () {
		var options = this.props.data.options;
		console.log(options);

		var title = options.title || this.defaults.title;
		options.buttons = options.buttons || this.defaults.buttons;
		var counter = 1;
		var self = this;
		var buttons = options.buttons.map(function(button){
			if(typeof button === 'string'){
				button = {title: button};
			}
			if(typeof button != 'object')
				return false;
			button.key = counter;
			return <AlertModal.Button didClickButton={self.didClickButton} key={counter++} data={button} />
		});
		var message = "";
		if(options.message){
			message = <div className="message">{options.message}</div>;
		}
		return (
			<div className="modal-full">
				<h2>{title}</h2>
				{message}
				<div className="buttons">
					{buttons}
				</div>
			</div>
		);
	}
});
AlertModal.Button = React.createClass({
	onClick: function(){
		console.log(this.props);
		this.props.didClickButton(this.props.data.key);
	},
	defaults: {
		title: "Submit"
	},
	render: function(){
		var data = this.props.data;

		var title = data.title || this.defaults.title;
		return (
			<button onClick={this.onClick}>{title}</button>
		);
	}
})

module.exports = AlertModal;