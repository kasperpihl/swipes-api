var React = require('react');
var Reflux = require('reflux');
var chatStore = require('../stores/ChatStore');
var chatActions = require('../actions/ChatActions');
var ChatItem = require('./chat_item');

var ChatList = React.createClass({
	mixins: [Reflux.connect(chatStore, "sections")],
	shouldScrollToBottom: true,
	onScroll: function(e){
		
		var contentHeight = $('.chat-list').outerHeight()
		var scrollPos = $('.chat-list-container').scrollTop()
		var viewHeight = $('.chat-list-container').outerHeight()
		
		if( (viewHeight+scrollPos) >= contentHeight ){
			this.shouldScrollToBottom = true;
		}
		else{
			this.shouldScrollToBottom = false;
		}
	},
	scrollToBottom: function(force){
		var scrollPosForBottom = $('.chat-list').outerHeight() - $('.chat-list-container').outerHeight() 
		if(this.shouldScrollToBottom && scrollPosForBottom != $('.chat-list-container').scrollTop() ){
			$('.chat-list-container').scrollTop(scrollPosForBottom);
		}
		var topPadding = 0;
		if($('.chat-list').outerHeight() < $('.chat-list-container').outerHeight())
			topPadding = $('.chat-list-container').outerHeight() - $('.chat-list').outerHeight();
		$('.chat-list-container').css("paddingTop", topPadding + "px");
		
	},
	handleResize: function(){
		this.scrollToBottom();
	},
	onChangedTextHeight: function(height){
		$("#content").css("paddingBottom", height);
		this.scrollToBottom();
	},
	onSendingMessage:function(){
		this.shouldScrollToBottom = true;
	},
	componentDidUpdate: function(){
		this.scrollToBottom();
	},
	componentDidMount: function(){
		window.addEventListener('resize', this.handleResize);
	},
	componentWillUnmount: function() {
		window.removeEventListener('resize', this.handleResize);
	},
	render: function() {

		var sections = this.state.sections.map(function(section){
			return <ChatList.Section key={section.title} data={section} />
		})
		return (
			<div onScroll={this.onScroll} ref="scroll-container" className="chat-list-container">
				<div className="chat-list">
					{sections}
				</div>
				<ChatList.Input onSendingMessage={this.onSendingMessage} onChangedTextHeight={this.onChangedTextHeight} />
			</div>
		);
	}
});



ChatList.Section = React.createClass({
	render: function() {
		var chatItems = this.props.data.messages.map(function(item){
			return <ChatList.ChatItem key={item.ts} data={item} />;
		});
		return (
			<div className="section">
				<div className="chat-date-line">
					<div className="line"></div>
					<div className="date">
						<span>{this.props.data.title}</span>
					</div>
				</div>
				
				{chatItems}
			</div>
		);
	}
});

ChatList.Input = React.createClass({
	hasShownHint: false,
	getEl:function(name){
		return $(this.refs[name].getDOMNode());	
	},
	onKeyDown: function(e){
		if(e.keyCode === 13 && !e.shiftKey)
			e.preventDefault();
	},
	getInitialState:function(){
		return {};
	},
	onTextChange: function(){
		var $textarea = this.getEl("textarea");
		var text = $textarea.val();
		var extraPadding = 0;
		if((text.length > 0) && !this.state.showHint){
			extraPadding = 15;
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
		this.props.onChangedTextHeight($main.outerHeight() + extraPadding);
	},
	onKeyUp: function(e){
		//console.log(e.keyCode, e.shiftKey, e.target);
		
		if (e.keyCode === 13 && !e.shiftKey ) {
			var message = this.getEl("textarea").val();
			if(message && message.length > 0){
				this.sendMessage(message);
			}
		}
	},
	sendMessage: function(message){
		this.getEl("textarea").val("");
		this.props.onSendingMessage();
		this.onTextChange();
		chatActions.sendMessage(message);
	},
	onBlur: function(e){
		//console.log(e.keyCode, e.shiftKey, e.target);
		//$('.hint').toggleClass('show-hint', false);
		
		var $textarea = this.getEl("textarea");
		var text = $textarea.val();
		if((!text || text.length == 0) && this.state.showHint ){
			this.setState({showHint:false});
			$main = this.getEl("input-container");
			this.props.onChangedTextHeight($main.outerHeight() - 15);
		}
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


ChatList.ChatItem = ChatItem;


module.exports = ChatList;
