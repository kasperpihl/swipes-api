var React = require('react');
var ChatInputStore = require('../stores/ChatInputStore');
var chatActions = require('../actions/ChatActions');
var chatInputActions = require('../actions/ChatInputActions');
var moment = require('moment');
var FontIcon = require('material-ui/lib/font-icon');
var IconButton = require('material-ui/lib/icon-button');
var TextField = require('material-ui/lib/text-field');

var CircularProgress = require('material-ui/lib/circular-progress');
var Textarea = require('react-textarea-autosize');

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
			this.refs.input.blur();
		}
		if (e.keyCode === 13 && !e.shiftKey ) {
			var message = this.refs.input.value;
			if(message && message.length > 0 && !this.state.isSending){
				this.sendMessage(message);
			}
		}
	},
	onClick: function(){
		var message = this.state.inputValue;
		if(!message.length){
			message = ":+1:";
		}
		this.sendMessage(message);
		this.refs.input.focus();
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
	onHeightChange: function(height){
		chatInputActions.changeInputTextHeight(height);
	},
	onFocus:function(){
		chatInputActions.focus();
	},
	onBlur: function(){
		chatInputActions.blur();
	},
	componentDidUpdate(prevProps, prevState) {
		var defaultTextHeight = 70;
		var textHeight = this.state.inputTextHeight || 0;
		var height = Math.max(defaultTextHeight, textHeight);
	    this.props.onRenderingInputHeight(height);
	},
	onPaste: function(e) {
		var items = (e.clipboardData || e.originalEvent.clipboardData).items;
		this.setState({isUploading: true});
  	for (index in items) {
    	var item = items[index];
    	if (item.kind === 'file') {
      	var blob = item.getAsFile();
				chatActions.uploadClipboard(blob, function(){
					console.log('remove state');
					this.setState({isUploading: false});
				}.bind(this))
    	}
  	}
	},
	render: function() {
		var defaultTextHeight = 70;
		var textHeight = this.state.inputTextHeight || 0;
		var height = Math.max(defaultTextHeight, textHeight);

		var sendIcon = (this.state.inputValue.length > 0) ? "send" : "thumb_up";
		var disabled = this.state.isSending ? true : false;
		var uploadButton = <FontIcon className="material-icons">attach_file</FontIcon>;
		if( this.state.isUploading )
			uploadButton = <CircularProgress color="#777" size={0.5} />;

		var className = "todo-input";
		if(this.state.isFocused){
			className += " focused";
		}

		return (
			<div className={className} style={{height: height + 'px'}}>
				<input ref="file" type="file" onChange={this.onFileChange} className="file-input" />
				<Textarea
					placeholder="Quick reply"
					id="chat-input"
					ref="input"
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onChange={this.onChange}
					onKeyDown={this.onKeyDown}
	     		onKeyUp={this.onKeyUp}
					onHeightChange={this.onHeightChange}
					onPaste={this.onPaste}
					value={this.state.inputValue}
					minRows={1}
					maxRows={6}>
				</Textarea>
				<div onClick={this.onAttach} className="action-button attach-icon">
					{uploadButton}
				</div>
				<div onClick={this.onClick} className="action-button send-button">
					<FontIcon className="material-icons">{sendIcon}</FontIcon>
				</div>
			</div>
		);
	}
});
/*
<input id="chat-input" ref="input" type="text" placeholder="Quick reply" onChange={this.onChange}
	      value={this.state.inputValue}
	      ref="textfield"
	      onKeyDown={this.onKeyDown}
	      onKeyUp={this.onKeyUp}/>
 */
module.exports = ChatInput;
