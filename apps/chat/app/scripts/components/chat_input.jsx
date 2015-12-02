var React = require('react');
var chatActions = require('../actions/ChatActions');

var ChatInput = React.createClass({
	hasShownHint: false,
	getEl:function(name){
		return $(this.refs[name].getDOMNode());	
	},
	onKeyDown: function(e){
		if(e.keyCode === 13 && !e.shiftKey)
			e.preventDefault();

	},
	componentDidMount: function(){
		this.debouncedCheck = _.debounce(this.hideHint, 2000);
		console.log("debounced", this.debouncedCheck);
	},
	getInitialState:function(){
		return {};
	},
	onTextChange: function(){
		var $textarea = this.getEl("textarea");
		var text = $textarea.val();
		if((text.length > 0) && !this.state.showHint){
			this.setState({showHint:true});
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
		
		$main = this.getEl("input-container");
		this.props.onChangedTextHeight($main.outerHeight());
	},
	onKeyUp: function(e){
		//console.log(e.keyCode, e.shiftKey, e.target);
		if(e.keyCode === 27){
			this.getEl("textarea").blur();	
		}
		if (e.keyCode === 13 && !e.shiftKey ) {
			var message = this.getEl("textarea").val();
			if(message && message.length > 0){
				this.sendMessage(message);
			}
		}
		this.debouncedCheck();
	},
	sendMessage: function(message){
		this.getEl("textarea").val("");
		this.props.onSendingMessage();
		this.onTextChange();
		chatActions.sendMessage(message);
	},
	hideHint: function(){
		var $textarea = this.getEl("textarea");
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
		return (
			<div ref="input-container" className={hintClass} >
				{/* <input type="file" id="file-input" /> 
				<div className="attach-button-container">
				</div>*/}
				<i className="material-icons chat-input-attach-icon" >attach_file</i>
				<div className="hint">Write message</div>
				<textarea ref="textarea" data-autoresize tabIndex="1" onBlur={this.onBlur} onChange={this.onTextChange} onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp} id="new-message-textarea" rows="1"></textarea>  
			</div>
		);
	}
});

module.exports = ChatInput;