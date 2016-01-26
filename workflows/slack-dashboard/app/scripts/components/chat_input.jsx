var React = require('react');
var chatActions = require('../actions/ChatActions');

var FontIcon = require('material-ui/lib').FontIcon;
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
			var message = this.refs.textfield.getValue();
			if(message && message.length > 0){
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
		chatActions.sendMessage(message);
		this.setState({text: ''});
	},
	onChange: function(event, v2){
		this.setState({text: event.target.value})
	},
	render: function() {
		var sendIcon = (this.state.text.length > 0) ? "send" : "thumb_up";

		return (

			<div ref="input-container" >
				<div style={{
					position: 'absolute',
					bottom: 0,
					paddingLeft: '10px',
					paddingRight: '60px',
					borderTop: '1px solid #d5d5d5',
					height: '50px',
					width: '100%'
				}}>
					<TextField
						placeholder="Quick Reply" 
						onChange={this.onChange} 
						value={this.state.text} 
						ref="textfield"
						onKeyDown={this.onKeyDown} 
						onKeyUp={this.onKeyUp} 
						fullWidth={true} 
						style={{
					}}/>
				</div>
				<div style={{
						position: 'absolute',
						bottom: 0,
						width: '50px',
						height: '50px',
						right: 0,
						paddingTop: '14px',
						textAlign: 'center'
					}}
					onClick={this.onClick} >
					<FontIcon className="material-icons" style={{

					}}>{sendIcon}</FontIcon>
				</div>
            </div>
		);
	}
});

module.exports = ChatInput;
