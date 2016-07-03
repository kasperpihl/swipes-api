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


var socketStore = require('../../stores/SocketStore');
var topbarStore = require('../../stores/TopbarStore');
var topbarActions = require('../../actions/TopbarActions');
var eventActions = require('../../actions/EventActions');
var WorkspaceStore = require('../../stores/WorkspaceStore');
var stateStore = require('../../stores/StateStore');
var gradient = require('./gradient');
// var notificationStore = require('../stores/NotificationStore');
// var notificationActions = require('../actions/NotificationActions');


var Topbar = React.createClass({
	//mixins: [notificationStore.connect() ],
	mixins: [WorkspaceStore.connect('workspace'), topbarStore.connect('topbar')],
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	componentDidMount() {
	    this.gradientStep();
	},
	clickedAdd: function(){
		if(this.state.topbar.isFullscreen) {
			eventActions.fire("closeFullscreen");
		}
		else if(this.state.topbar.isSearching){
			topbarActions.changeSearch(false);
		}
		else {
			topbarActions.loadWorkflowModal();
		}
	},
	clickedSearch:function(){
		topbarActions.changeSearch(true);
	},
	signout: function () {
		amplitude.setUserId(null); // Log out user from analytics
		stateStore._reset({trigger: false});
		localStorage.clear();
		swipesApi.setToken(null);
		window.location.replace('/');
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
	gradientStep:function(){
		var gradientPos = gradient.getGradientPos();
		if(this.state.gradientPos != gradientPos){
			this.setState({gradientPos: gradientPos});
		}
		setTimeout(this.gradientStep, 3000);
	},
	componentDidUpdate(prevProps, prevState) {
	    if(this.state.topbar.focusOnSearch){
	    	this.refs.searchInput.focus();
	    	topbarActions.clearFocusVar();
	    }  
	},
	render: function() {
		var title = (document.location.pathname.startsWith("/services")) ? "Services" : "Workspace";
		var topbarClass = 'sw-topbar';
		var styles = {};

		if(this.state.gradientPos) {
			styles.backgroundPosition = this.state.gradientPos + '% 50%';
		}

		if(this.state.topbar.isFullscreen) {
			topbarClass += ' fullscreen'
		}
		if(this.state.topbar.isSearching){
			topbarClass += ' search';
		}

		return (
			<div className={topbarClass} style={styles}>
				<div className="sw-topbar__content">

					<div className="sw-topbar__info">
						<div className="sw-topbar__info__icon">
							<img src="styles/img/workspace-icon.svg" alt=""/>
						</div>
						<div className="sw-topbar__info__title">my workspace</div>
					</div>
					<div className="sw-topbar__searchbar">
						<input ref="searchInput" placeholder="Search your apps" />
					</div>
					<div className="sw-topbar__actions">
						<div className="sw-topbar__button sw-topbar__button--search" onClick={this.clickedSearch}>
							<i className="material-icons">search</i>
						</div>
						<div className="sw-topbar__button sw-topbar__button--add" onClick={this.clickedAdd}>
							<i className="material-icons">add</i>
						</div>
					</div>

				</div>
			</div>
		)
	}
});

module.exports = Topbar;
