var React = require('react');

var Sidemenu = React.createClass({
	renderItems: function(){
		var items = this.props.data.rows || [];
		//items = fakeItems;
		return items.map(function(item, i){
			return <Sidemenu.Item onClick={this.onClick} data={item} key={i}/>;
		}.bind(this));
	},
	componentWillUpdate: function(nextProps, nextState) {
		if(!this.didTry){
			this.setState({"new": []});
			this.didTry = true;
		}

	},
	render: function() {
		var className = "swipes-sidemenu";
		return (
			<div className={className} onMouseLeave={this.onMouseLeave} onMouseEnter={this.onMouseEnter} style={this.props.style}>
				<div className="scroller">
					{this.renderItems()}
				</div>
			</div>
		);
	},
	onClick: function(data){
		if(typeof this.props.onSelectedRow === 'function'){
			this.props.onSelectedRow(data);
		}
	}
});

/*
	JSON Structure
	{
		name: string
		unread: BOOL
		notificationCount: int
		active: BOOL // if is current active, only 1 allowed
	}
 */

Sidemenu.Item = React.createClass({
	renderNotification:function(){
		var count = parseInt(this.props.data.notificationCount, 10);
		var even = (count % 2 == 0) ? "even" : "odd";

		if(count){
			var className = "notification " + even;
			return <div className={className}>{count}</div>;
		}
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
			<div className="indicator" />
			{this.renderNotification()}
			<div className="name">{this.props.data.name}</div>
		</div>);
	},
	onClick: function(){
		this.props.onClick(this.props.data);
	}
})
var fakeItems = [{
	name: "creative",
	unread: true,
	notificationCount: 0
},
{
	name: "dev-report",
	unread: false,
	notificationCount: 0,
	active: true
},
{
	name: "general",
	unread: true,
	notificationCount: 2
},
{
	name: "product-discussion",
	unread: false,
	notificationCount: 0
}];
module.exports = Sidemenu;