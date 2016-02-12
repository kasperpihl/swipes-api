var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var leftNavStore = require('../stores/LeftNavStore');
var leftNavActions = require('../actions/LeftNavActions');
// Icon Menu dependencies
var LeftNav = require('material-ui/lib').LeftNav;
var Badge = require('material-ui/lib').Badge;

var MenuItem = require('material-ui/lib').MenuItem;

var LeftNavModal = React.createClass({
	mixins: [ leftNavStore.connect('leftNav') ],
	onRequestChange: function(open){
		if(!open){
			leftNavActions.hide(false);
		}
	},
	clicked: function(itemId){
		leftNavActions.hide(itemId);
	},
	renderItems:function(){
		var items = this.state.leftNav.items;
		var renderedItems = [];

		_.each(items, function(item){
			var style = {lineHeight: '30px'};
			if(!item || typeof item.id !== 'string' || typeof item.title !== 'string' ){
				console.log('invalid item for left nav', item);
				return;
			}
			if(item.bold){
				style.fontWeight = 800;
			}
			if(item.current){
				style.backgroundColor = "#ddd";
			}
			var badge;
			if(item.badge){
				var badge = <Badge badgeContent={item.badge}
					style={{padding: 0, margin:0}}
					badgeStyle={{backgroundColor: 'red', top: '-15px', left: '3px', color: 'white', fontSize: '10px', paddingLeft: '3px', paddingRight: '3px', height: '20px', minWidth:'20px', width: 'auto'}}>
				</Badge>
			}
			renderedItems.push( <MenuItem 
					key={item.id} 
					style={style}
					onTouchTap={this.clicked.bind(this, item.id)}>
					{item.title}
					{badge}
				</MenuItem>);
		}.bind(this));
		return renderedItems;
	},
	render: function() {
		return (
			<LeftNav
				docked={false}
				width={200}
				disableSwipeToOpen={true}
				style={{paddingTop: '100px'}}
				open={this.state.leftNav.open}
				onRequestChange={this.onRequestChange}>
				{this.renderItems()}
			</LeftNav>
		);
	}
});

module.exports = LeftNavModal;
