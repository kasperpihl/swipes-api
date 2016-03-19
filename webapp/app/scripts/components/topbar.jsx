var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var socketStore = require('../stores/SocketStore');
var topbarStore = require('../stores/TopbarStore');
var topbarActions = require('../actions/TopbarActions');
var stateStore = require('../stores/StateStore');

// Icon Menu dependencies
var MenuItem = require('material-ui/lib/menus/menu-item');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var IconButton = require('material-ui/lib/icon-button');
var Colors = require('material-ui/lib/styles/colors');
var FontIcon = require('material-ui/lib/font-icon');


var Topbar = React.createClass({
	mixins: [ Reflux.ListenerMixin ],
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState: function(){
		return {};
	},
	clickedAdd: function(){
		topbarActions.loadWorkflowModal();
	},
	signout: function () {
		amplitude.setUserId(null); // Log out user from analytics
		stateStore._reset({trigger: false});
		localStorage.clear();
		swipes.setToken(null);
		this.context.router.push('/signin');
	},
	workspace: function(){
		this.context.router.push('/workspace');
	},
	services: function(){
		this.context.router.push('/services');
	},
	renderIconMenu:function(){
		var button = (

			<IconButton
				style={{padding: '12px !important'}}
				touch={true}>
			<FontIcon className="material-icons">menu</FontIcon>
			</IconButton>
		);
		return (
			<IconMenu
				style={{position: 'absolute', left: '6px', top: '6px', width: '44px', height: '44px'}}
				iconButtonElement={button}
				anchorOrigin={{horizontal: 'left', vertical: 'center'}}
				targetOrigin={{horizontal: 'right', vertical: 'top'}} >
				<MenuItem primaryText="Workspace" onClick={this.workspace} />
				<MenuItem primaryText="Services" onClick={this.services} />
				<MenuItem primaryText="Sign out" onClick={this.signout} />
			</IconMenu>
		);
	},

	render: function() {

		return (
			<div className="top-bar-container">
				{this.renderIconMenu()}
				<h5>Workspace</h5>
				<div className="add-button" onClick={this.clickedAdd}>
					<i className="material-icons">add_box</i>
				</div>
			</div>
		);
	}
});

module.exports = Topbar;
