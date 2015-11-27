var React = require('react');

var ChatItem = React.createClass({
	render: function() {

		return (
			<div className="chat-message">
				<div className="chat-left-side-container">
				</div>
				<div className="chat-right-side-container">
					<div className="message-container">
						{this.props.data.text}
					</div>
				</div>
			</div>
		);
	}
});


module.exports = ChatItem;