var React = require('react');


var ChannelPreview = React.createClass({
	render: function () {
		return (
			<div className="channel-preview">
				channel: {this.props.data.obj.text}
			</div>
		);
	}
});

module.exports = ChannelPreview;
