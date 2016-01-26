var React = require('react');
var Reflux = require('reflux');
var chatStore = require('../stores/ChatStore');
var chatActions = require('../actions/ChatActions');
var ChatItem = require('./chat_item');
var ChatInput = require('./chat_input');
var channelStore = require('../stores/ChannelStore');
var Card = require('material-ui/lib').Card;
var CardTitle = require('material-ui/lib').CardTitle;

var SelectField = require('material-ui/lib').SelectField;

var MenuItem = require('material-ui/lib').MenuItem;
var ChatList = React.createClass({
	mixins: [chatStore.connect('chat'), channelStore.connect('channels')],
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
	},
	scrollToBottom: function(animate){
		var scrollPosForBottom = $('.chat-list').outerHeight() - $('.chat-list-container').outerHeight()
		if(scrollPosForBottom > 0 && this.shouldScrollToBottom && scrollPosForBottom != $('.chat-list-container').scrollTop() ){
			this.hasRendered = true;
			if(animate)
				$('.chat-list-container').animate({ scrollTop: scrollPosForBottom }, 300);
			else
				$('.chat-list-container').scrollTop(scrollPosForBottom);
		}
		var topPadding = 0;
		if($('.chat-list').outerHeight() < $('.chat-list-container').outerHeight())
			topPadding = $('.chat-list-container').outerHeight() - $('.chat-list').outerHeight();
		$('.chat-list-container').css("paddingTop", topPadding + "px");
	},
	handleResize: function(){
		this.scrollToBottom(this.hasRendered);
	},
	onSendingMessage:function(){
		this.shouldAnimateScroll = true;
		this.shouldScrollToBottom = true;
	},
	componentDidUpdate: function(prevProps, prevState){
		this.scrollToBottom(this.hasRendered);
	},
	componentDidMount: function(){
		window.addEventListener('resize', this.handleResize);
	},
	componentWillUnmount: function() {
		window.removeEventListener('resize', this.handleResize);
	},
	renderLoading: function(){
		if(this.state.chat.sections){
			return '';
		}
		
		return <div>Loading Messages</div>
	
	},
	renderSections: function(){
		if(!this.state.chat.sections){
			return '';
		}

		return this.state.chat.sections.map(function(section){
			return <ChatList.Section key={section.title} data={section} />
		});

	},
	onChangedChannel: function(e, i, row){
		chatActions.setChannel(row);
		var newSettings = {channelId: row};
		var self = this;
		swipes.api.request('users.updateWorkflowSettings', {workflow_id: swipes.info.workflow.id, settings: newSettings}, function(res, err){
		})
		
	},
	renderChannelSelector: function(){
		var channels = [];
		if(this.state.channels){
			channels = this.state.channels.map(function(channel){
				return <MenuItem key={channel.id} value={channel.id} primaryText={channel.name} />
			});
		}
		return (
			<SelectField value={this.state.channelId} onChange={this.onChangedChannel}>
				{channels}
			</SelectField>
		)
	},
	renderInput: function(){
		return <ChatInput onSendingMessage={this.onSendingMessage} />
	},
	renderChannelHeader: function(){
		return (
			<div style={{
				position: 'absolute',
				height: '30px',
				borderBottom: '1px solid #d5d5d5',
				width: '100%',
				textAlign: 'center',
				fontSize: '18px',
				lineHeight: '30px',
				top: 0,
				left: 0
			}}>
			{this.state.chat.channel.name}
			</div>
		)
	},
	render: function() {
		if(!swipes.info.workflow){
			return <div>"LOADING..."</div>;
		}
		else if(!this.state.chat.channel){
			return (
				<div>
					<h3>Select Channel</h3>
					{this.renderChannelSelector()}
				</div>
			);
		}
		
		return (

			<Card className="card-container">
				{this.renderChannelHeader()}
				<div onScroll={this.onScroll} ref="scroll-container" className="chat-list-container">
					<div className="chat-list">
						{this.renderLoading()}
						{this.renderSections()}
					</div>
				</div>
				{this.renderInput()}
			</Card>
		);
	}
});
ChatList.Section = React.createClass({
	render: function() {
		var chatItemsGroups = [];
		var chatItemMessages = [];

		this.props.data.messages.forEach(function (item) {
			if (item.isExtraMessage === false) {
				if (chatItemMessages.length > 0) {
					chatItemsGroups.push(chatItemMessages);
					chatItemMessages = [];
				}

				chatItemMessages.push(item);
			} else {
				chatItemMessages.push(item);
			}
		});

		// Push the last messages to a group
		chatItemsGroups.push(chatItemMessages);

		var chatItems  = chatItemsGroups.map(function (item) {
			return <ChatItem key={item[0].ts} data={item} />;
		})

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

module.exports = ChatList;
;