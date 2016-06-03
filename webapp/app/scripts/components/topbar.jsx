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
var workspaceActions = require('../actions/WorkspaceActions');
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
	// setNotifications: function() {
	// 	notificationActions.setNotifications();
	// },
	illuminateHidden: function(id) {
		var cardEl = document.getElementById(id);
		if (cardEl && cardEl.classList.contains('minimized')) {
			cardEl.style.transform = 'scale(1)';
			cardEl.style.visibility = 'visible';
			cardEl.style.opacity = '1';
		}
	},
	removeIlluminationFromHidden: function(id) {
		var cardEl = document.getElementById(id);
		if (cardEl && cardEl.classList.contains('minimized')) {
			cardEl.style.transform = 'scale(0)';
			cardEl.style.visibility = 'hidden';
			cardEl.style.opacity = '0';
		}
	},
	dockMouseEnter: function (cardId) {
		WorkspaceStore.setIlluminatedCardId(cardId);
		this.illuminateHidden(cardId);
	},
	dockMouseLeave: function (cardId) {
		WorkspaceStore.setIlluminatedCardId(null);
		this.removeIlluminationFromHidden(cardId);
	},
	renderDock: function () {
		var self = this;
		var cards = this.state.workspace;
		var addClassName = 'dock_item-add';
		var dockItems = [];

		cards.forEach(function (card, index) {
			var className = 'dock_item';

			if (card.hidden) {
				className += ' minimized'
			} else if (card.focused) {
				className += ' focused'
			}

			if (card.notifications > 0) {
				className += ' notification';
			}

			dockItems.push(
				<div
					onMouseEnter={function () {
							self.dockMouseEnter(card.id);
					}}
					onMouseLeave={function () {
						self.dockMouseLeave(card.id);
						}
					}
					onClick={self.dockMouseLeave}
					className={className}
					key={index} >
					<img
						src={card.icon_url}
						onClick={function () {
							workspaceActions.showHideCard(card.id);
						}}
					/>
				</div>
			)
		})

		if (dockItems.length === 0) {
			addClassName += ' pulsate'
		}

		dockItems.push(
			<div className={addClassName} onClick={this.clickedAdd} key={uuid.v4()}>
				<FontIcon className="material-icons">add</FontIcon>
			</div>
		)

		return (
			<div className="dock-wrapper">
				{dockItems}
			</div>
		)
	},
	render: function() {
		var title = (document.location.pathname.startsWith("/services")) ? "Services" : "Workspace";
		// var notificationIcon = 'notifications';
		//
		// if (!this.state.notificationState) {
		// 	notificationIcon = 'notifications_off'
		// }

		if (title === "Services") {
			return (
				<div className="top-bar-container">
					{this.renderIconMenu()}
					<div className="topbar-title"><span>{title}</span></div>
					<div className="feedback-button" onClick={this.feedbackForm} style={{right: '10px'}}>
						Send Feedback
					</div>
				</div>
			)
		} else {
			return (
				<div className="top-bar-container">
					{this.renderIconMenu()}
					<div className="topbar-title"><span>{title}</span></div>
					{this.renderDock()}
					<div className="feedback-button" onClick={this.feedbackForm} style={{right: '60px'}}>
						Send Feedback
					</div>

					<div className="grid-button" onClick={workspaceActions.gridButton} style={{right: '10px'}}>
						<i className="material-icons">dashboard</i>
					</div>
				</div>
			);
		}
	}
});

module.exports = Topbar;
