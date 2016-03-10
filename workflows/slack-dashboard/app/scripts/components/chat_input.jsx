var React = require('react');
var chatActions = require('../actions/ChatActions');

var FontIcon = require('material-ui/lib').FontIcon;
var IconButton = require('material-ui/lib').IconButton;
var TextField = require('material-ui/lib').TextField;

var ChatInput = React.createClass({
	hasShownHint: false,
	currentLength: 0,
	onKeyDown: function(e){
		if(e.keyCode === 13 && !e.shiftKey)
			e.preventDefault();

	},
	getInitialState:function(){
		return { text: "" };
	},
	onKeyUp: function(e){
		if(e.keyCode === 27){
			this.refs.textfield.blur();
		}
		if (e.keyCode === 13 && !e.shiftKey ) {
			var message = this.refs.textfield.value;
			console.log(message);
			if(message && message.length > 0 && !this.state.isSending){
				this.sendMessage(message);
			}
		}
	},
	onClick: function(){
		console.log('clicked');
		var message = this.state.text;
		if(!message.length){
			message = ":+1:";
		}
		this.sendMessage(message);
		this.refs.textfield.focus();
	},
	sendMessage: function(message){
		//this.refs.textfield.clearValue();
		this.props.onSendingMessage();
		chatActions.sendMessage(message, function(){
			this.setState({isSending: false});
		}.bind(this));
		this.setState({text: '', isSending: true});
	},
	onChange: function(event, v2){
		this.setState({text: event.target.value})
	},
	render: function() {
		var sendIcon = (this.state.text.length > 0) ? "send" : "thumb_up";
		var disabled = this.state.isSending ? true : false;
		return (

			<div className="todo-input">

				<input ref="input" type="text" placeholder="Quick reply" onChange={this.onChange}
	      value={this.state.text}
	      ref="textfield"
	      onKeyDown={this.onKeyDown}
	      onKeyUp={this.onKeyUp}/>
				<div className={"task-add-icon"}>
					<FontIcon className="material-icons" onClick={this.onClick}>{sendIcon}</FontIcon>
				</div>
			</div>
		);
	}
});

module.exports = ChatInput;
