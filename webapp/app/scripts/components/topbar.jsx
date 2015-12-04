var React = require('react');

var Reflux = require('reflux');
var stateStore = require('../stores/StateStore');
var Topbar = React.createClass({
	mixins: [ Reflux.ListenerMixin ],
	onDualButton: function(e){
		console.log("pressed dual button", this.props.data.screen);
	},
	onStateChange: function(states){
		var newState = {};
		if(states.connectionStatus != this.state.connectionStatus)
			newState.connectionStatus = states.connectionStatus;
		if(_.size(newState)){
			console.log("setting state");
			this.setState(newState);
		}
	},
	onMenuButton:function(e){
		stateActions.toggleSidebar();
	},
	getInitialState: function(){
		return {};
	},
	componentWillMount: function(){
		if(this.props.data.screen === 1){
			this.listenTo(stateStore, this.onStateChange, this.onStateChange);
		}
	},
	render: function() {
		var openOrCloseButton = "open";
		if(this.props.data.screen > 1){
			openOrCloseButton = "close";
		}
		if(this.props.data.disableDualScreen)
			openOrCloseButton = "";
		var status = "";
		if(this.state && this.state.connectionStatus)
			status = this.state.connectionStatus;
		var styles = {
			color:"white",
			right: "0",
			position: "absolute"
		};

		return (
			<div className="top-bar-container">
				<span style={styles}>{status}</span>
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
