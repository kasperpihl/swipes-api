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
		console.log(viewHeight, scrollPos, viewHeight+scrollPos, contentHeight);
		if( (viewHeight+scrollPos) >= contentHeight ){
			this.shouldScrollToBottom = true;
		}
		else{
			this.shouldScrollToBottom = false;
		}

	},
	scrollToBottom: function(){
		var scrollPosForBottom = $('.chat-list').outerHeight() - $('.chat-list-container').outerHeight() 
		if(this.shouldScrollToBottom && scrollPosForBottom != $('.chat-list-container').scrollTop() ){
			
			$('.chat-list-container').scrollTop(scrollPosForBottom);
		}
		
	},
	onChangedTextHeight: function(height){
		$("#content").css("paddingBottom", height);
		this.scrollToBottom();
	},
	componentDidUpdate: function(){
		this.scrollToBottom();
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
				<ChatList.Input onChangedTextHeight={this.onChangedTextHeight} />
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
					<div className="date">{this.props.data.title}</div>
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
		console.log("getting initial state");
		return {};
	},
	onTextChange: function(){
		if(!this.hasShownHint){
			var self = this;
			this.setState({showHint:true});
			this.hasShownHint = true;
			setTimeout(function(){
				self.setState({showHint:false});
			},3000);
		}
		var $textarea = this.getEl("textarea");
		var text = $textarea.val(); 
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
		
		if (e.keyCode === 13 && !e.shiftKey ) {
			var message = $(e.target).val();
			if(message && message.length > 0){
				$(e.target).val("");
				this.onTextChange();
				chatActions.sendMessage(message);
			}
		}
	},
	render: function() {
		var hintClass = "input-container ";
		console.log(this.state);
		if(this.state.showHint)
			hintClass += "show-hint";
		return (
			<div ref="input-container" className={hintClass} data-chat-channel-info="You're typing in #general">
				{/* <input type="file" id="file-input" /> 
				<div className="attach-button-container">
				</div>*/}
				<i className="material-icons chat-input-attach-icon">attach_file</i>
				<textarea ref="textarea" data-autoresize tabIndex="1" onChange={this.onTextChange} onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp} id="new-message-textarea" rows="1"></textarea>  
			</div>
		);
	}
});


ChatList.ChatItem = ChatItem;


module.exports = ChatList;
