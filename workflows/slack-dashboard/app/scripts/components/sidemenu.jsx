var React = require('react');

/*
	JSON Structure
	{
		name: string
		unread: int // number of unread messages (shows indicator)
		notification: int // number of notification to show (shows number)
		active: BOOL // if is current active, only 1 allowed
		user: BOOL // if is a user or not (e.g. bot, channel etc.)
	}
 */

var Sidemenu = React.createClass({
	getInitialState: function() {
		return {};
	},
	togglePin:function(){
		console.log("pinning", !(this.state.pinned));
		this.setState({pinned: !(this.state.pinned)});
	},
	render: function() {
		var className = "swipes-sidemenu";
		if(this.state.pinned){
			className += " pinned";
		}
		if(this.state.forceClose){
			className += " force-close";
		}

		var items = this.props.data.rows || [];

		var renderedChannels = items.map(function(item, i){
			if (!item.user) {
				return <Sidemenu.Item onClick={this.onClick} data={item} key={i}/>;
			}
		}.bind(this));

		var renderedUsers = items.map(function(item, i){
			if (item.user) {
				return <Sidemenu.Item onClick={this.onClick} data={item} key={i}/>;
			}
		}.bind(this));

		var overlayAbove, overlayBelow;
		return (
			<div className={className} onMouseLeave={this.onMouseLeave} onMouseEnter={this.onMouseEnter} style={this.props.style}>
				{overlayAbove}
				<div ref="scroller" className="scroller">
					<h3>Channels</h3>
					{renderedChannels}
					<h3>Direct Messages</h3>
					{renderedUsers}
				</div>
				{overlayBelow}
			</div>
		);
	},
	onClick: function(data){
		if(typeof this.props.onSelectedRow === 'function'){
			this.props.onSelectedRow(data);
			this.setState({forceClose: true});
			setTimeout(function(){
				this.setState({forceClose: false});
			}.bind(this), 1500);
		}
	}
});


Sidemenu.Item = React.createClass({
	renderNotification:function(){
		var count = parseInt(this.props.data.notification, 10);
		var even = (count % 2 == 0) ? "even" : "odd";

		if(count){
			var className = "notification " + even;
			return <div className={className}>{count}</div>;
		}
	},
	renderIndicator:function(){
		var count = parseInt(this.props.data.unread, 10);
		var even = (count % 2 == 0) ? "even" : "odd";
		var className = "indicator ";

		if(count){
			className += even;
		}
		return <div className={className} />
	},
	render: function(){
		var className = "menu-item";
		var presence = '';
		if(this.props.data.unread){
			className += " unread";
		}
		if(this.props.data.active){
			className += " active";
		}
		if(this.props.data.user && this.props.data.presence === 'active') {
			presence = 'presence active'
		} else if (this.props.data.user) {
			presence = 'presence'
		} else if (!this.props.data.user) {
			presence = ''
		}


		return (
			<div onClick={this.onClick} className={className}>
				{this.renderIndicator()}
				{this.renderNotification()}
				<div className={"name " + presence}>{this.props.data.name}</div>
		</div>
	);


	},
	onClick: function(){
		this.props.onClick(this.props.data);
	}
})
module.exports = Sidemenu;
