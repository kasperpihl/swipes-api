var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var socketStore = require('../stores/SocketStore');
var topbarStore = require('../stores/TopbarStore');
var topbarActions = require('../actions/TopbarActions');
var workspaceActions = require('../actions/WorkspaceActions');
var stateStore = require('../stores/StateStore');
var notificationStore = require('../stores/NotificationStore');
var notificationActions = require('../actions/NotificationActions');

// Icon Menu dependencies
var MenuItem = require('material-ui/lib/menus/menu-item');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var IconButton = require('material-ui/lib/icon-button');
var Colors = require('material-ui/lib/styles/colors');
var FontIcon = require('material-ui/lib/font-icon');


var Topbar = React.createClass({
	mixins: [notificationStore.connect() ],
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
			<IconMenu
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
	setNotifications: function() {
		notificationActions.setNotifications();
	},
	render: function() {
		var title = (document.location.pathname.startsWith("/services")) ? "Services" : "Workspace";
		var notificationIcon = 'notifications';

		if (!this.state.notificationState) {
			notificationIcon = 'notifications_off'
		}

		return (
			<div className="top-bar-container">
				{this.renderIconMenu()}
				<h5>{title}</h5>
				<div className="feedback-button" onClick={this.feedbackForm}>
					Send Feedback
				</div>
				<div className="grid-button" onClick={workspaceActions.gridButton}>
					<i className="material-icons">dashboard</i>
				</div>
				<div className="add-button" onClick={this.clickedAdd}>
					<i className="material-icons">add</i>
				</div>
			</div>
		);
	}
});

module.exports = Topbar;
