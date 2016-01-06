var React = require('react');
var chatActions = require('../actions/ChatActions');

var ChatInput = React.createClass({
	hasShownHint: false,
	currentLength: 0,
	onKeyDown: function(e){
		if(e.keyCode === 13 && !e.shiftKey)
			e.preventDefault();

	},
	componentDidMount: function(){
		this.debouncedCheck = _.debounce(this.hideHint, 2000);
		var $textarea = $(this.refs.textarea);
        $textarea.focus();
	},
	getInitialState:function(){
		return {};
	},
	onTextChange: function(){
		var $textarea = $(this.refs.textarea);
		var text = $textarea.val();

		if (text.length > 0) {
			$('i.chat-input-mobile-send').addClass('active');
			$('i.chat-input-attach-icon').addClass('active');

			if (!this.state.showHint) {
				this.setState({showHint:true});
			}
			// Check if last character is @ or #, and make sure we are not deleting back to it.
			// K_TODO make this work with where the cursor is
			var lastChar = text.slice(-1);
			if ((lastChar === "@" || lastChar === "#") && text.length > this.currentLength) {
				var testString = text.substr(0,text.length-1);
				var title = 'Find thread';
				if(lastChar === '@')
					title = 'Mention';
				if (text.length == 1 || /\s+$/.test(testString)) {
					swipes.modal.search({title:title},function(res){
						if(res){
							if(typeof res === 'string'){
								$textarea.val(text += res);
							}
							else if(typeof res === 'object' && lastChar === "#"){
								$textarea.val(text.slice(0,-1));
								chatActions.setThread({appId:res.appId, id: res.id, title: res.text});
							}
							else if(typeof res === 'object' && lastChar === "@"){
								$textarea.val(text += res.text);
							}
							
						}
						$textarea.focus();
					});
				}
			}
			} else if (text.length === 0) {
				$('i.chat-input-mobile-send').removeClass('active');
				$('i.chat-input-attach-icon').removeClass('active');
			}

		var lines = text.split(/\r|\r\n|\n/);
		var count = lines.length;

		var currentRows = $textarea.attr('rows');
		if (currentRows < 6) {
			$textarea.attr('rows', count);
			$textarea.height();
		} else if (text.length == 0 ) {
			$textarea.attr('rows', '1');
		}
		this.currentLength = text.length;
		$main = $(this.refs["input-container"]);
		this.props.onChangedTextHeight($main.outerHeight());
	},
	onKeyUp: function(e){
		var $textarea = $(this.refs.textarea);
		//console.log(e.keyCode, e.shiftKey, e.target);
		if(e.keyCode === 27){
			$textarea.blur();
		}
		if (e.keyCode === 13 && !e.shiftKey ) {
			var message = $textarea.val();
			if(message && message.length > 0){
				this.sendMessage(message);
			}
		}
		this.debouncedCheck();
	},
	onClick: function(){
		var $textarea = $(this.refs.textarea);
		var message = $textarea.val();
		if(message && message.length > 0){
			this.sendMessage(message);
			$textarea.focus();
		}
	},
	sendMessage: function(message){
		$(this.refs.textarea).val("");
		this.props.onSendingMessage();
		this.onTextChange();
		chatActions.sendMessage(message);
	},
	hideHint: function(){
		var $textarea = $(this.refs.textarea);
		var text = $textarea.val();
		if((!text || text.length == 0) && this.state.showHint ){
			this.setState({showHint:false});
		}
	},
	onBlur: function(e){
		//console.log(e.keyCode, e.shiftKey, e.target);
		//$('.hint').toggleClass('show-hint', false);
		this.hideHint();

	},
	componentDidUpdate: function(){

	},
	render: function() {
		var hintClass = "input-container ";
		if(this.state.showHint)
			hintClass += "show-hint";
		
		var placeholder = "Message";
		
		var threadHtml = "";
		var channelName = this.props.data.channel ? this.props.data.channel.name : "";
		
		if(this.props.data.thread)
			threadHtml = <span className="input-thread">{" # " + this.props.data.thread.title}</span>;
		if(channelName.length > 0)
			placeholder +=  " " + channelName;

		
		return (
			<div ref="input-container" className={hintClass} >
				{/* <input type="file" id="file-input" />
				<div className="attach-button-container">
				</div>*/}
                <div className="mobile-search-at-sign">@</div>
				<i className="material-icons chat-input-attach-icon" ref="attach-icon">attach_file</i>
				<div className="hint">{placeholder}&nbsp;{threadHtml}</div>
				<textarea ref="textarea" data-autoresize tabIndex="1" onBlur={this.onBlur} onChange={this.onTextChange} onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp} id="new-message-textarea" rows="1"></textarea>
				<i className="material-icons chat-input-mobile-send" onClick={this.onClick} ref="send-icon">send</i>
                
                // http://codepen.io/iremlopsum/pen/JGWbjV contenteditable
			</div>
		);
	}
});

module.exports = ChatInput;
