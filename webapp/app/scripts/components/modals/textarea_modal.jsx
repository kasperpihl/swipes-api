var React = require('react');
var Textarea = require('react-textarea-autosize');

var TextareaModal = React.createClass({
	didClickButton: function(button){
		var dataToReturn = null;
		if(button === 2){
			dataToReturn = this.refs.message.value;
		}
		this.props.data.callback(dataToReturn);
	},
	defaults: {
		title: "Edit Text"

	},
	getInitialState() {
	    var initialData = {};
	    if(this.props.data.options){
	    	initialData.message = this.props.data.options.message || "";
	    }
	    return initialData;
	},
	onMessageChange: function(e){
		this.setState({'message': e.target.value});
	},
	render: function () {
		var options = this.props.data.options;

		var title = options.title || this.defaults.title;
		options.buttons = ["Cancel", "Submit"];
		var counter = 1;
		var self = this;
		var buttons = options.buttons.map(function(button){
			if(typeof button === 'string'){
				button = {title: button};
			}
			if(typeof button != 'object')
				return false;
			button.key = counter;
			return <TextareaModal.Button didClickButton={self.didClickButton} key={counter++} data={button} />
		});

		return (
			<div className="modal-full">
				<h2>{title}</h2>
				<div className="modal-content">
					<Textarea
						ref="message"
						className="edit-textarea"
						onChange={this.onMessageChange}
						placeholder="Edit text"
						value={this.state.message}
						minRows={4}
						maxRows={4}/>
				</div>
				<div className="buttons">
					{buttons}
				</div>
			</div>
		);
	}
});
TextareaModal.Button = React.createClass({
	onClick: function(){
		this.props.didClickButton(this.props.data.key);
	},
	render: function(){
		var data = this.props.data;

		var title = data.title || this.defaults.title;
		return (
			<button onClick={this.onClick}>{title}</button>
		);
	}
})

module.exports = TextareaModal;