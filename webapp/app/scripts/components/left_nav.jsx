var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var leftNavStore = require('../stores/LeftNavStore');
var leftNavActions = require('../actions/LeftNavActions');
// Icon Menu dependencies
var LeftNav = require('material-ui/lib/left-nav');
var Badge = require('material-ui/lib/badge');

var MenuItem = require('material-ui/lib/menus/menu-item');
var List = require('material-ui/lib/lists/list');
var ListItem = require('material-ui/lib/lists/list-item');

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
	renderItems:function(items, toggleFromPrimary){
		var items = items || this.state.leftNav.items;
		var toggleFromPrimary = toggleFromPrimary || false;
		var renderedItems = [];

		_.each(items, function(item){
			var nestedItems = [];
			var style = {};
			var initiallyOpen = true;
			var badge;

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


			if(item.badge){
				badge = <Badge badgeContent={item.badge}
					style={{padding: 0, margin:0}}
					badgeStyle={{backgroundColor: 'red', top: '-15px', left: '3px', color: 'white', fontSize: '10px', paddingLeft: '3px', paddingRight: '3px', height: '20px', minWidth:'20px', width: 'auto'}}>
				</Badge>
			}

			if (item.nested && item.nested.length > 0) {
				toggleFromPrimary = true;
				nestedItems = this.renderItems(item.nested, false);
				style.paddingLeft = "16px";
			}
			

			var primaryText = <div>{item.title}{badge}</div>;

			renderedItems.push( <ListItem
					key={item.id}
					style={style}
					autoGenerateNestedIndicator={false}
					nestedListStyle={{padding: 0}}
					innerDivStyle={{paddingTop: '8px', paddingBottom: '8px', paddingLeft: '0px'}}
					onTouchTap={this.clicked.bind(this, item.id)}
					primaryText={primaryText}
					nestedItems={nestedItems}
					initiallyOpen={initiallyOpen}
					primaryTogglesNestedList={toggleFromPrimary}
					>
				</ListItem>);
		}.bind(this));

		return renderedItems;
	},
	render: function() {
		return (
			<LeftNav
				docked={false}
				width={200}
				disableSwipeToOpen={true}
				style={{paddingTop: '60px'}}
				open={this.state.leftNav.open}
				onRequestChange={this.onRequestChange}>
				<List children={this.renderItems(null, false)}></List>
			</LeftNav>
		);
	}
});

module.exports = LeftNavModal;
