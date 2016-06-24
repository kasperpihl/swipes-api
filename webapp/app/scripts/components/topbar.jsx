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

var oldTime = null;
var fullDaySeconds = 86400;
var gradientSegmentPercentage = 100 / 11;
var daySegments = [
	{
		time: 37.5, // 00:00 - 09:00
		width: gradientSegmentPercentage / 2
	},
	{
		time: 4.166666, // 09:00 - 10:00
		width: gradientSegmentPercentage * 2 + (gradientSegmentPercentage / 2)
	},
	{
		time: 33.333333, // 10:00 - 18:00
		width: gradientSegmentPercentage * 2 - (gradientSegmentPercentage / 2)
	},
	{
		time: 6.25, // 18:00 - 19:30
		width: gradientSegmentPercentage * 4 + (gradientSegmentPercentage / 2)
	},
	{
		time: 18.75, // 19:30 - 00:00
		width: gradientSegmentPercentage * 2
	}
];

var getGradientPos = function(percentOfDay, daySegments) {
	var segLen = daySegments.length;
	var segTimeSum = 0;
	var currentWidth = 0;

	for (var i=0; i<segLen; i++) {
		var seg = daySegments[i];

		segTimeSum = segTimeSum + seg.time;

		if (percentOfDay >= segTimeSum) {
			currentWidth = currentWidth + seg.width;
		} else {
			var prevSegSum = segTimeSum - seg.time;
			var portionOfDay = percentOfDay - prevSegSum;
			var percentOfSeg = portionOfDay / seg.time * 100;
			var width = seg.width * percentOfSeg / 100;

			currentWidth = currentWidth + width;
			break;
		}
	}

	//var currentTimePercentage = percentOfDay / prevSegSum * 100;
	var currentGradientPosition = (100 * currentWidth) / 100;

	return currentGradientPosition;
}

function precentOfCurrentDay() {
	var today = new Date();
	var hoursSeconds = today.getHours() * 60 * 60;
	var minutesSeconds = today.getMinutes() * 60;
	var seconds = today.getSeconds();
	var currentTimeSeconds = hoursSeconds + minutesSeconds + seconds;
	var percentOfCurrentDay = currentTimeSeconds / fullDaySeconds * 100;

	return percentOfCurrentDay;
}

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
	gradientStep:function(){
		var percentOfDay = precentOfCurrentDay();
		var gradientPos = getGradientPos(percentOfDay, daySegments);
		gradientPos = Math.round( gradientPos * 1e2 ) / 1e2;
		if(this.state.gradientPos != gradientPos){
			this.setState({gradientPos: gradientPos});
		}
		setTimeout(this.gradientStep, 3000);
	},

	render: function() {
		var title = (document.location.pathname.startsWith("/services")) ? "Services" : "Workspace";
		var topbarClass = 'sw-topbar';
		var buttonClass = 'add';
		var styles = {};

		if(this.state.gradientPos) {
			styles.backgroundPosition = this.state.gradientPos + '% 50%';
		}

		if(this.state.topbar.isFullscreen) {
			topbarClass += ' fullscreen'
			buttonClass += ' close'
		}

		return (
			<div className={topbarClass} style={styles}>
				<div className="sw-topbar__content">

					<div className="sw-topbar__info">
						<div className="sw-topbar__info__icon">
							<img src="styles/img/swipes-logo.png" alt=""/>
						</div>
						<div className="sw-topbar__info__title"><span>{title}</span></div>
					</div>

					<div className="sw-topbar__actions">
						<div className="sw-topbar__button sw-topbar__button--search">
							<i className="material-icons">search</i>
						</div>
						<div className="sw-topbar__button sw-topbar__button--add" onClick={this.feedbackForm}>
							<i className="material-icons">add</i>
						</div>
					</div>

				</div>
			</div>
		)
	}
});

module.exports = Topbar;
