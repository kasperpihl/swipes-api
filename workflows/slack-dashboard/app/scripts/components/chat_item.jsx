var React = require('react');
var chatActions = require('../actions/ChatActions');
var ReactEmoji = require('react-emoji');
var UserStore = require('../stores/UserStore');
var FontIcon = require('material-ui/lib/font-icon');
var SwipesDot = require('swipes-dot').default;

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
				<span className="message-author">{name}</span> <span className="message-time">{message.timeStr}</span>
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
	renderSecondaryTime: function(){
		var message = this.props.data;
		if(!message.isExtraMessage){
			return;
		}
		return (
			<div className="secondary-time">
				<span className="message-time">
					{message.timeStr}
				</span>
			</div>
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
					{this.renderSecondaryTime()}
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
	mixins: [
		ReactEmoji
	],
	share: function (text) {
		var shareData = this.shareData(text);

		swipes.share.request(shareData);
	},
	shareData: function (text) {
    return {
      text: text
    }
  },
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
		var file = this.props.data.file;
		if(!file){
			return;
		}
		return <ChatMessage.File key={file.id} data={file} />
	},
	renderMessage:function(message){
		try{
			return renderTextWithLinks(message, this.emojify);
		}
		catch(e){
			console.log('emojis', message);
		}
	},
	dotItems: function () {
    var that = this;
    var items = [];

		var message = this.props.data;

		var shareItem = {
			label: 'Share',
			icon: 'share',
			callback: function () {
				that.share(message.text);
			}
		};

		if (!message.userObj) {
			items.push(shareItem);

			return items;
		}

		if (message.userObj.me) {
			items.push({
				label: 'Edit',
				icon: 'edit',
				callback: function () {
					chatActions.editMessage(message.text, message.ts);
				}
			});
			items.push({
				label: 'Delete',
				icon: 'delete',
				callback: function () {
					chatActions.deleteMessage(message.ts);
				}
			})
		}

    items = items.concat([ shareItem ]);

    return items;
  },
	render: function () {
		var message = this.props.data;
		var className = "message-wrapper";
		if(this.props.data.isNewMessage){
			className += " new-message";
		}
		var dotItems = this.dotItems();
		return (
			<div id={message.ts} className={className}>
				<div className="message">
					<SwipesDot
						className="dot"
						reverse="true"
						showOnHover={true}
						hoverParentId={message.ts}
						elements={dotItems}
						onDragData={this.shareData.bind(this, message.text)}
						menuColors={{
							borderColor: 'transparent',
							hoverBorderColor: '#1DB1FC',
							backgroundColor: '#1DB1FC',
							hoverBackgroundColor: 'white',
							iconColor: 'white',
							hoverIconColor: '#1DB1FC'
						}}
						labelStyles={{
							transition: '.1s',
							boxShadow: 'none',
							backgroundColor: 'rgba(0, 12, 47, 1)',
							padding: '5px 10px',
							top: '-12px',
							fontSize: '16px',
							letterSpacing: '1px',
							zIndex: '99'
						}}
					/>
					{this.renderMessage(this.props.data.text)}
					{this.renderFile()}
					{this.renderAttachments()}
				</div>
			</div>
		);
	}
});

ChatMessage.File = React.createClass({
	renderPreview: function(){


		if(this.props.data.thumb_360){
			console.log("file",this.props.data);
			// T_TODO: Check the this.props.data.thumb_360
			// The issue is that if the user is not logged in, this link won't work. Try open in incognito
			return this.renderImagePreview();
		}
		else{
			return this.renderDefaultPreview();
		}
	},
	openImage: function() {
		var src = this.props.data.url_private_download;
		var title = this.props.data.title;
		var url = this.props.data.permalink;

		chatActions.openImage(src, title, url);
	},
	renderImagePreview: function(){
		return (
			<div className="image-container">
				<div className="image-bg" style={{width: this.props.data.thumb_360_w + 'px', height: this.props.data.thumb_360_h, backgroundImage: 'url(' + this.props.data.thumb_360 + ')'}}>
					<img onClick={this.openImage} src={this.props.data.thumb_360} />
				</div>
			</div>
		);
	},
	renderDefaultPreview: function(){

	},
	render: function(){
		return (
			<div className="file-container">
				{this.renderPreview()}
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
			var innerObj = <div className="attachment-title">{this.props.data.title}</div>;
			if(this.props.data.title_link){
				return <a className='link' onClick={clickedLink.bind(null, this.props.data.title_link)}>{innerObj}</a>
			}
			return innerObj;
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
var renderTextWithLinks = function(text, emojiFunction){
	if(!text || !text.length)
		return text;
	if(typeof emojiFunction !== 'function'){
		emojiFunction = function(par){ return par; };
	}
	text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
	var matches = text.match(/<(.*?)>/g);

	var replaced = [];

	if ((matches != null) && matches.length) {
		var splits = text.split(/<(.*?)>/g);
		var counter = 0;

		// Adding the text before the first match
		replaced.push(emojiFunction(splits.shift()));
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
				var command = res[0];
				var title = res[res.length -1];
				if(title.startsWith("@U")){
					var user = UserStore.get(title.substr(1));
					if(user){
						title = "@" + user.name;
					}
				}

				var key = 'link' + (counter++);
				placement = <a key={key} className='link' onClick={clickedLink.bind(null, innerMatch)}>{title}</a>;
			}

			// Adding the replacements
			replaced.push(placement);

			// Adding the after text between the matches
			replaced.push(emojiFunction(splits.shift()));
		}
		if(replaced.length)
			return replaced;
	}
	return emojiFunction(text);
};


module.exports = ChatItem;
