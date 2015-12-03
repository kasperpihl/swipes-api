var React = require('react');
var homeActions = require('../actions/HomeActions');

var Topbar = React.createClass({
	onDualButton: function(e){
		console.log("pressed dual button", this.props.data.screen);
	},
	onMenuButton:function(e){
		homeActions.toggleSidebar();
	},
	render: function() {

		var openOrCloseButton = "open";
		if(this.props.data.screen > 1){
			openOrCloseButton = "close";
		}
		if(this.props.data.disableDualScreen)
			openOrCloseButton = "";
		return (
			<div className="top-bar-container">
				<div onClick={this.onMenuButton} className="menu-icon-container">
					<div className="menu-icon open"></div>
				</div>
				<div onClick={this.onDualButton} className={"icon-dual-view-container " + openOrCloseButton}>
					<div className="icon-dual-view">
						<div className="box"></div>
						<div className="box"></div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Topbar;
