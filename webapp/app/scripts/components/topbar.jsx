var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var uuid = require('uuid');

// Material ui dependencies
var MenuItem = require('material-ui/lib/menus/menu-item');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var IconButton = require('material-ui/lib/icon-button');
var Colors = require('material-ui/lib/styles/colors');
var FontIcon = require('material-ui/lib/font-icon');

var socketStore = require('../stores/SocketStore');
var topbarStore = require('../stores/TopbarStore');
var topbarActions = require('../actions/TopbarActions');
var WorkspaceStore = require('../stores/WorkspaceStore');
var stateStore = require('../stores/StateStore');
// var notificationStore = require('../stores/NotificationStore');
// var notificationActions = require('../actions/NotificationActions');

var Topbar = React.createClass({
	//mixins: [notificationStore.connect() ],
	mixins: [WorkspaceStore.connect('workspace')],
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	clickedAdd: function(){
		topbarActions.loadWorkflowModal();
	},
	signout: function () {
		amplitude.setUserId(null); // Log out user from analytics
		stateStore._reset({trigger: false});
		localStorage.clear();
		swipes.setToken(null);
		window.location.replace('/');
	},
	workspace: function(){
		this.context.router.push('/workspace');
	},
	services: function(){
		this.context.router.push('/services');
	},
	feedbackForm: function() {
		topbarActions.loadWorkflowModal();
		return;
		mixpanel.track('Feedback Init');
		topbarActions.sendFeedback();
	},
	renderIconMenu:function(){
		var button = (

			<IconButton
				style={{padding: '12px !important'}}
				touch={true}>
			<FontIcon className="material-icons" color='#666D82'>menu</FontIcon>
			</IconButton>
		);
		return (
			<IconMenu className="topbar-iconmenu"
				style={{position: 'absolute', left: '1px', top: '1px', width: '48px', height: '48px'}}
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
		var title = (document.location.pathname.startsWith("/services")) ? "Services" : "Workspace";

		return (
			<div className="top-bar-container">
				{this.renderIconMenu()}
				<div className="topbar-title"><span>{title}</span></div>
				<div className="feedback-button" onClick={this.feedbackForm} style={{right: '10px'}}>
					Send Feedback
				</div>
			</div>
		);
	}
});

module.exports = Topbar;
