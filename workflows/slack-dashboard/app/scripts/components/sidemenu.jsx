var React = require('react');

/*
	JSON Structure
	{
		name: string
		unread: int // number of unread messages (shows indicator)
		notification: int // number of notification to show (shows number)
		active: BOOL // if is current active, only 1 allowed
	}
 */

var Sidemenu = React.createClass({
	componentDidUpdate: function(prevProps, prevState) {

	},
	render: function() {
		var className = "swipes-sidemenu";

		var items = this.props.data.rows || [];
		var renderedItems = items.map(function(item, i){
			return <Sidemenu.Item onClick={this.onClick} data={item} key={i}/>;
		}.bind(this));

		var overlayAbove, overlayBelow;
		return (
			<div className={className} onMouseLeave={this.onMouseLeave} onMouseEnter={this.onMouseEnter} style={this.props.style}>
				{overlayAbove}
				<div ref="scroller" className="scroller">
					{renderedItems}
				</div>
				{overlayBelow}
			</div>
		);
	},
	onClick: function(data){
		if(typeof this.props.onSelectedRow === 'function'){
			this.props.onSelectedRow(data);
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
		if(this.props.data.unread){
			className += " unread";
		}
		if(this.props.data.active){
			className += " active";
		}
		return (<div onClick={this.onClick} className={className}>
			{this.renderIndicator()}
			{this.renderNotification()}
			<div className="name">{this.props.data.name}</div>
		</div>);
	},
	onClick: function(){
		this.props.onClick(this.props.data);
	}
})
module.exports = Sidemenu;