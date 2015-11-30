var React = require('react');

var ChatItem = React.createClass({
	render: function() {

		return (
			<div className="chat-message">
				<div className="chat-avatar">
					<div className="avatar">
						<img src="https://unsplash.it/50/?random" />
					</div>
				</div>
				<div className="chat-content">
					<div className="chat-top-side-container">
						<p className="name">{this.props.data.user.name}</p>
					</div>
					<div className="chat-bottom-side-container">
						<p className="message-container">
							{this.props.data.text}
						</p>
					</div>
				</div>
			</div>
		);
	}
});


module.exports = ChatItem;