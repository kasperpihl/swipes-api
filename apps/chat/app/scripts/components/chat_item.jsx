var React = require('react');

var BottomSideContainer = React.createClass({
	render: function () {
		return (
			<div className="chat-bottom-side-container" data-time={this.props.data.timeStr}>
				<p className="message-container">
				 <span dangerouslySetInnerHTML={{__html: this.props.data.text}}/>
				</p>
			</div>
		);
	}
})

var ChatItem = React.createClass({
	render: function() {
		var className = "chat-message ";
		// if(this.props.data.isExtraMessage)
		// 	className += "extra-message ";
		// T TODO delete that when we dont need it anymore
		// if(this.props.data.user.name == "kristjan")
		// 	className += "me-right";
		if(this.props.data.isNewMessage)
			className += "new-message ";

		if (this.props.data.isExtraMessage) {
			return (
				<BottomSideContainer data={this.props.data} />
			);
		} else {
			return (
				<div className={className}>
					<div className="chat-avatar">
						<div className="avatar">
							<img src={this.props.data.user.profile.profile_image} />
						</div>
					</div>
					<div className="chat-content">
						<div className="chat-top-side-container">
							<p className="name">{this.props.data.user.name} <span className="chat-timestamp">{this.props.data.timeStr}</span></p>
						</div>
						<BottomSideContainer data={this.props.data} />
					</div>
				</div>
			);
		}
	}
});


module.exports = ChatItem;
