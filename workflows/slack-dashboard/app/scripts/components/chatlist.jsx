var React = require('react');
var Reflux = require('reflux');
var chatStore = require('../stores/ChatStore');
var chatActions = require('../actions/ChatActions');
var ChatItem = require('./chat_item');
var ChatInput = require('./chat_input');
var channelStore = require('../stores/ChannelStore');
var Card = require('material-ui/lib').Card;
var CardTitle = require('material-ui/lib').CardTitle;
var CircularProgress = require('material-ui/lib').CircularProgress;
var SelectField = require('material-ui/lib').SelectField;
var Badge = require('material-ui/lib').Badge;
var MenuItem = require('material-ui/lib').MenuItem;
var ChatList = React.createClass({
	mixins: [chatStore.connect('chat')],
	shouldScrollToBottom: true,
	hasRendered: false,
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

		this.checkForMarkingAsRead();
		//console.log($('.new-message-header').position(), )
	},
	checkForMarkingAsRead: function(){
		// Check for unread marker
		var scrollPos = $('.chat-list-container').scrollTop()
		var viewHeight = $('.chat-list-container').outerHeight()
		if($('.new-message-header').length){
			var posForUnread = $('.new-message-header').position().top - scrollPos;
			if(posForUnread > 0 && posForUnread < viewHeight){
				this.bouncedMarkAsRead()
			}
		}
	},
	scrollToBottom: function(animate){
		var scrollPosForBottom = $('.chat-list').outerHeight() - $('.chat-list-container').outerHeight()
		if(scrollPosForBottom > 0 && this.shouldScrollToBottom && scrollPosForBottom != $('.chat-list-container').scrollTop() ){
			this.hasRendered = true;
			if(animate)
				$('.chat-list-container').animate({ scrollTop: scrollPosForBottom }, 50);
			else
				$('.chat-list-container').scrollTop(scrollPosForBottom);
		}
		var topPadding = 0;
		if($('.chat-list').outerHeight() < $('.chat-list-container').outerHeight())
			topPadding = $('.chat-list-container').outerHeight() - $('.chat-list').outerHeight();
		$('.chat-list-container').css("paddingTop", topPadding + "px");
	},
	handleResize: function(){
		this.bouncedScroll(this.hasRendered);
	},
	onSendingMessage:function(){
		this.shouldAnimateScroll = true;
		this.shouldScrollToBottom = true;
	},
	componentDidUpdate: function(prevProps, prevState){
		this.scrollToBottom(this.hasRendered);
	},
	componentDidMount: function(){
		this.bouncedScroll = _.debounce(this.scrollToBottom, 100);
		this.bouncedMarkAsRead = _.debounce(chatActions.markAsRead, 500);
		window.addEventListener('resize', this.handleResize);
	},
	componentWillUnmount: function() {
		window.removeEventListener('resize', this.handleResize);
	},
	renderLoading: function(){
		if(!this.state.chat.sections){
			return <CircularProgress style={{
				position: 'absolute',
				left: '50%',
				top: '50%',
				margin: 0,
				marginTop: '-25px',
				marginLeft: '-25px'
			}}/>;
		}
		
		
	
	},
	renderSections: function(){
		if(this.state.chat.sections){
			var showingUnread = this.state.chat.showingUnread;
			var isMarked = this.state.chat.showingIsRead;
			return this.state.chat.sections.map(function(section){
				return <ChatList.Section key={section.title} data={{isMarked: isMarked, showingUnread: showingUnread, section: section}} />
			});
		}
	},
	onChangedChannel: function(e, i, row){
		chatActions.setChannel(row);
		var newSettings = {channelId: row};
		var self = this;
		swipes.api.request('users.updateWorkflowSettings', {workflow_id: swipes.info.workflow.id, settings: newSettings}, function(res, err){
		})
		
	},
	renderInput: function(){
		return <ChatInput onSendingMessage={this.onSendingMessage} />
	},
	render: function() {
		if(!swipes.info.workflow){
			return <CircularProgress size={2} style={{
				position: 'absolute',
				left: '50%',
				top: '50%',
				margin: 0,
				marginTop: '-25px',
				marginLeft: '-25px'
			}}/>;
		}
		// K_TODO: Test if this works without channel
		return (
			<div className="card-container">
				<div onScroll={this.onScroll} ref="scroll-container" className="chat-list-container">
					{this.renderLoading()}
					<div className="chat-list">
						{this.renderSections()}
					</div>
				</div>
				{this.renderInput()}
			</div>
		);
	}
});
ChatList.Section = React.createClass({
	render: function() {
		var chatItems = [];
		_.each(this.props.data.section.messages, function (item, i) {
			if(!item.hidden){
				chatItems.push(<ChatItem key={item.ts} data={item} />);
			}
			if(item.ts === this.props.data.showingUnread && !item.isLastMessage){
				var className = "new-message-header";
				if(this.props.data.isMarked){
					className += " read";
				}
				chatItems.push(<div className={className} key="new-message-header"><span>new messages</span></div>);
				chatItems.push(<div key="new-message-post-header" className="new-message-post-header" />);
			}
		}.bind(this));

		return (
			<div className="section">
				<div className="chat-date-line">
					<div className="line"></div>
					<div className="date">
						<span>{this.props.data.section.title}</span>
					</div>
				</div>
				{chatItems}
			</div>
		);
	}
});

module.exports = ChatList;