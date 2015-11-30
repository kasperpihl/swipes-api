var React = require('react');

var ChatItem = React.createClass({
	render: function() {

		return (
			<div className="chat-message">
				<div className="chat-left-side-container">
					<p className="name">kristjan</p>
				</div>
				<div className="chat-right-side-container">
					<p className="message-container">
						{this.props.data.text}
					</p>
				</div>
			</div>
		);
	}
});


module.exports = ChatItem;