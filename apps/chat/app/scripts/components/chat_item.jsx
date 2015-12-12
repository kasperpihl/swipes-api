var React = require('react');

var ChatMessage = React.createClass({
	render: function () {
		return (
			<div className="message-wrapper">
				<div className="message">
					{this.props.data.text}
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
