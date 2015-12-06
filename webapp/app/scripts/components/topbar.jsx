var React = require('react');

var Reflux = require('reflux');
var stateStore = require('../stores/StateStore');
var socketStore = require('../stores/SocketStore');
var Topbar = React.createClass({
	mixins: [ Reflux.ListenerMixin ],
	onDualButton: function(e){
		console.log("pressed dual button", this.props.data.screen);
	},
	onSocketChange: function(states){
		var newState = {};
		if(states.status != this.state.connectionStatus)
			newState.connectionStatus = states.status;
		if(_.size(newState)){
			this.setState(newState);
		}
	},
	onStateChange: function(states){
		var newState = {};
		if(states.foregroundColor !== this.state.foregroundColor)
			newState.foregroundColor = states.foregroundColor;
		if(states.backgroundColor !== this.state.backgroundColor)
			newState.backgroundColor = states.backgroundColor;
		if(_.size(newState)){
			this.setState(newState);
		}
	},
	onMenuButton:function(e){
		stateStore.actions.toggleSidebar();
	},
	getInitialState: function(){
		return {};
	},
	componentWillMount: function(){
		if(this.props.data.screen === 1){
			this.listenTo(socketStore, this.onSocketChange, this.onSocketChange);
		}
		this.listenTo(stateStore, this.onStateChange, this.onStateChange);
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
		var labelStyle = {
			color:"white",
			right: "0",
			position: "absolute"
		};
		var styles = {};
		if(this.state.backgroundColor)
			styles.backgroundColor = this.state.backgroundColor;
		if(this.state.foregroundColor)
			styles.foregroundColor = this.state.foregroundColor;
		
		return (
			<div style={styles} className="top-bar-container">
				<span style={labelStyle}>{status}</span>
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
