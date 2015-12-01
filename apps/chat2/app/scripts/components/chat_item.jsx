var React = require('react');

var ChatItem = React.createClass({
	render: function() {
		var className = "chat-message ";
		if(this.props.data.isExtraMessage)
			className += "extra-message ";
		return (
			<div className={className}>
				<div className="chat-avatar">
					<div className="avatar">
						<img src="https://unsplash.it/50/?random" />
					</div>
				</div>
				<div className="chat-content">
					<div className="chat-top-side-container">
						<p className="name">{this.props.data.user.name} <span className="chat-timestamp">{this.props.data.timeStr}</span></p>
					</div>
					<div className="chat-bottom-side-container" data-time={this.props.data.timeStr}>
						<p className="message-container" dangerouslySetInnerHTML={{__html: this.props.data.text}}/>
					</div>
				</div>
			</div>
			
		);
	}
});


module.exports = ChatItem;