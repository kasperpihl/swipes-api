var React = require('react');
var ChatInputStore = require('../stores/ChatInputStore');
var chatActions = require('../actions/ChatActions');
var chatInputActions = require('../actions/ChatInputActions');

var FontIcon = require('material-ui/lib/font-icon');
var IconButton = require('material-ui/lib/icon-button');
var TextField = require('material-ui/lib/text-field');

var CircularProgress = require('material-ui/lib/circular-progress');

var ChatInput = React.createClass({
	mixins: [ChatInputStore.connect()],
	hasShownHint: false,
	currentLength: 0,
	onKeyDown: function(e){
		if(e.keyCode === 13 && !e.shiftKey)
			e.preventDefault();

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
		var message = this.state.inputValue;
		if(!message.length){
			message = ":+1:";
		}
		this.sendMessage(message);
		this.refs.textfield.focus();
	},
	onAttach: function(){
		if(this.state.isUplading){
			return;
		}
		this.refs.file.click();
	},
	sendMessage: function(message){
		//this.refs.textfield.clearValue();
		this.props.onSendingMessage();
		chatActions.sendMessage(message, function(){
			this.setState({isSending: false});
		}.bind(this));
		chatInputActions.changeInputValue('');
	},
	onFileChange:function(e){
		console.log(e.target.files);
		console.log('file changed hahaha', e);
		this.setState({isUploading: true});
		chatActions.uploadFile(e.target.files[0], function(){
			console.log('remove state');
			this.setState({isUploading: false});
		}.bind(this));
	},
	onChange: function(event){
		chatInputActions.changeInputValue(event.target.value);
	},
	render: function() {
		var sendIcon = (this.state.inputValue.length > 0) ? "send" : "thumb_up";
		var disabled = this.state.isSending ? true : false;
		var uploadButton = <FontIcon className="material-icons">attach_file</FontIcon>;
		if( this.state.isUploading )
			uploadButton = <CircularProgress color="#777" size={0.5} />;
		return (
			<div className="todo-input">
				<input ref="file" type="file" onChange={this.onFileChange} className="file-input" />
				<div onClick={this.onAttach} className="attach-icon">
					{uploadButton}
				</div>
				<input id="chat-input" ref="input" type="text" placeholder="Quick reply" onChange={this.onChange}
	      value={this.state.inputValue}
	      ref="textfield"
	      onKeyDown={this.onKeyDown}
	      onKeyUp={this.onKeyUp}/>
				<div onClick={this.onClick} className="send-button">
					<FontIcon className="material-icons">{sendIcon}</FontIcon>
				</div>
			</div>
		);
	}
});

module.exports = ChatInput;
