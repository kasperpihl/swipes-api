var React = require('react');
var channelActions = require('../actions/ChannelActions');
var clickedLink = function(match){
	var res = match.split("|");
	var clickObj = {};
	if(res[0])
		clickObj.command = res[0];
	if(res[1])
		clickObj.identifier = res[1];
	if(res[2])
		clickObj.title = res[2]; 
	console.log('clicked', clickObj);
	//channelActions.clickedLink(clickObj);

};
var renderTextWithLinks = function(text){
	if(!text || !text.length)
		return text;

	text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
	var matches = text.match(/<(.*?)>/g);
	
	var replaced = [];

	if ((matches != null) && matches.length) {
		var splits = text.split(/<(.*?)>/g);
		var counter = 0;
		
		// Adding the text before the first match
		replaced.push(splits.shift());
		for(var i = 0 ; i < matches.length ; i++ ){
			// The match is now the next object				
			var innerMatch = splits.shift();
			var placement = '';
			
			// If break, just add that as the placement
			if(innerMatch === 'br'){
				var key = 'break' + (counter++);
				placement = <br key={key}/>;
			}
			// Else add the link with the proper title
			else{
				var res = innerMatch.split("|");
				var title = res[res.length -1];
				var key = 'link' + (counter++);
				placement = <a key={key} className='link' onClick={clickedLink.bind(null, innerMatch)}>{title}</a>;
			}

			// Adding the replacements
			replaced.push(placement);

			// Adding the after text between the matches
			replaced.push(splits.shift());
		}
		if(replaced.length)
			return replaced;
	}
	return text;
};
var ChatMessage = React.createClass({
	renderAttachments:function(){
		if(!this.props.data.attachments){
			return;
		}
		var attachments = this.props.data.attachments.map(function(att){
			return <ChatMessage.Attachment key={att.id} data={att} />
		});
		return attachments;
	},
	renderFile: function(){
		if(!this.props.data.file){
			return;
		}
		console.log('file', this.props.data.file);
	},
	render: function () {
		var className = "message-wrapper";
		if(this.props.data.isNewMessage){
			className += " new-message";
		}
		return (

			<div className={className}>
				<div className="message">
				{renderTextWithLinks(this.props.data.text)}
				{this.renderFile()}
				{this.renderAttachments()}
				</div>
			</div>
		);
	}
});

ChatMessage.Attachment = React.createClass({
	renderPreview: function(){

	},
	renderPretext:function(){
		if(this.props.data.pretext){
			return <div className="attachment-pretext">{renderTextWithLinks(this.props.data.pretext)}</div>;
		}
	},
	renderTitle: function(){
		if(this.props.data.title){
			return <div className="attachment-title">{renderTextWithLinks(this.props.data.title)}</div>;
		}
	},
	renderAuthor: function(){

	},
	renderBar: function(){
		console.log(this.props.data);
		var styles = {};
		if(this.props.data.color){
			styles.backgroundColor = this.props.data.color;
		}
		return <div style={styles} className="attachment-bar" />;
	},
	render: function(){
		return (
			<div className="chat-attachment">
				{this.renderPretext()}
				{this.renderBar()}
				<div className="attachment-content">
					{this.renderTitle()}
				</div>
			</div>
		);
	}
});

var ChatItem = React.createClass({
	renderNameHeader: function(){
		var name = 'unknown';
		var lastMessage = this.props.data[this.props.data.length-1];
		if(lastMessage.user){
			name = lastMessage.user.name;
		}
		return (
			<div className="message-details">
				{name} {lastMessage.timeStr}
			</div>
		);
	},
	renderProfileImage:function(){
		var firstMessage = this.props.data[0];
		var profile_image;
		if(firstMessage.user && firstMessage.user.profile){
			profile_image = firstMessage.user.profile.image_48;
		}
		return (
			<div className="avatar">
				<img src={profile_image} />
			</div>
		);
	},
	render: function () {
		/*
		
		var meClassName = swipes.info.userId === firstMessage.user.id ? ' me' : '';
		var chatWrapperClassName = 'chat-wrapper' + meClassName;*/
		var messages = this.props.data.map(function (message) {
			return <ChatMessage key={message.ts} data={message} />
		});
		return (
			<div className='chat-wrapper'>
				{this.renderProfileImage()}
				<div className="chat-messages">
					{this.renderNameHeader()}
					{messages}
				</div>
			</div>
		);
	}
});


module.exports = ChatItem;
