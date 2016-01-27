var React = require('react');
var chatActions = require('../actions/ChatActions');


var ChatItem = React.createClass({
	renderNameHeader: function(){
		var name = 'unknown';
		var message = this.props.data;
		if(message.isExtraMessage){
			return;
		}

		if(message.userObj){
			name = message.userObj.name;
		}
		else if(message.bot){
			name = message.bot.name;
		}
		return (
			<div className="message-details">
				{name} {message.timeStr}
			</div>
		);
	},
	renderProfileImage:function(){
		var message = this.props.data;
		if(message.isExtraMessage){
			return;
		}

		var profile_image = 'https://i0.wp.com/slack-assets2.s3-us-west-2.amazonaws.com/8390/img/avatars/ava_0002-48.png?ssl=1';
		if(message.userObj && message.userObj.profile){
			profile_image = message.userObj.profile.image_48;
		}
		else if(message.bot && message.bot.icons){
			if(message.bot.icons.image_48){
				profile_image = message.bot.icons.image_48;
			}
		}
		return (
			<img src={profile_image} />
		);
	},
	renderMessage:function(){
		var message = this.props.data;
		return <ChatMessage key={message.ts} data={message} />;
	},
	render: function () {
		/*
		
		var meClassName = swipes.info.userId === firstMessage.user.id ? ' me' : '';
		var chatWrapperClassName = 'chat-wrapper' + meClassName;*/
		var className = "chat-wrapper";
		if(this.props.data.isExtraMessage){
			className += " extra-message";
		}

		return (
			<div className={className}>
				<div className="left-side-container">
					{this.renderProfileImage()}
				</div>
				<div className="right-side-container">
					{this.renderNameHeader()}
					{this.renderMessage()}
				</div>
			</div>
		);
	}
});


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
		//return < console.log('file', this.props.data.file);
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

ChatMessage.File = React.createClass({
	render: function(){
		return (
			<div className="file-container">
				
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
	renderServiceName: function(){
		if(this.props.data.service_name){
			return <div className="attachment-service-name">{this.props.data.service_name}</div>
		}
	},
	renderTitle: function(){
		if(this.props.data.title){
			return <div className="attachment-title">{renderTextWithLinks(this.props.data.title)}</div>;
		}
	},
	renderText: function(){
		if(this.props.data.text){
			return <div className="attachment-body">{renderTextWithLinks(this.props.data.text)}</div>;
		}
	},
	renderImage: function(){
		if(this.props.data.image_url){
			// KRIS_TODO: Render lightbox
			var calcHeight = this.props.data.image_height;
			if(this.props.data.image_width > 400){
				var proportion = this.props.data.image_width / 400;
				calcHeight = calcHeight / proportion;
			}
			return <div className="attachment-image"><img height={calcHeight} src={this.props.data.image_url} /></div>;
		}
	},
	renderAuthor: function(){

	},
	renderBar: function(){
		var styles = {};
		if(this.props.data.color){
			styles.background = '#' + this.props.data.color;
		}
		return <div style={styles} className="attachment-bar" />;
	},
	render: function(){
		return (
			<div className="chat-attachment">
				{this.renderPretext()}
				{this.renderBar()}
				<div className="attachment-content">
					{this.renderServiceName()}
					{this.renderTitle()}
					{this.renderText()}
					{this.renderImage()}
				</div>
			</div>
		);
	}
});





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
	chatActions.clickLink(clickObj.command);

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


module.exports = ChatItem;
