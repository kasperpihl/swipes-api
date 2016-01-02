var React = require('react');

var ChatMessage = React.createClass({
	clickedLink:function(match){
		var res = match.split("|");
		var command = res[0];
		var identifier = res[1];
		var title = res[2];
		console.log("clicked link", match, this);
	},
	renderTextWithLinks: function(text){
		text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
		var matches = text.match(/<(.*?)>/g);
		
		var replaced = [];

		if ((matches != null) && matches.length) {
			var splits = text.split(/<(.*?)>/g);
			var counter = 0;
			console.log(text, matches, splits);
			// Adding the text before the first match
			replaced.push(splits.shift());
			for(var i = 0 ; i < matches.length ; i++ ){
				// The match is now the next object				
				var innerMatch = splits.shift();
				var placement = '';
				

				if(innerMatch === 'br'){
					var key = 'break' + (counter++);
					placement = <br key={key}/>;
				}
				else{
					var res = innerMatch.split("|");
					var command = res[0];
					var placement = "";
					var title = res[res.length -1];
					var key = 'link' + (counter++);
					placement = <a key={key} className='link' onClick={this.clickedLink.bind(null, innerMatch)}>{title}</a>;
				}

				replaced.push(placement);
				
				replaced.push(splits.shift());
			}
			if(replaced.length)
				return replaced;
        	return text;
		}
	},
	render: function () {
		var className = "message-wrapper";
		if(this.props.data.isNewMessage)
			className += " new-message";
		return (
			<div className={className}>
				<div className="message">
				{this.renderTextWithLinks(this.props.data.text)}
				</div>
			</div>
		);
	}
});

var ChatItem = React.createClass({
	render: function () {
		var firstMessage = this.props.data[0];
		var lastMessage = this.props.data[this.props.data.length-1];
		var meClassName = swipes.info.userId === firstMessage.user.id ? ' me' : '';
		var chatWrapperClassName = 'chat-wrapper' + meClassName;
		var messages = this.props.data.map(function (message) {
			return <ChatMessage key={message.ts} data={message} />
		});

		return (
			<div className={chatWrapperClassName}>
				<div className="avatar">
					<img src={firstMessage.user.profile.profile_image} />
				</div>
				<div className="message-details">
					{lastMessage.user.name} {lastMessage.timeStr}
				</div>
				<div className="chat-messages">
					{messages}
				</div>
			</div>
		);
	}
});


module.exports = ChatItem;
