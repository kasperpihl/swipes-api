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
        if (this.state.connectionStatus === 'online') {
            $('.loader').css('display', 'none');
            $('.connection-icon').html('check');
            $('.connection-status').css('background-color', '#4CAF50').delay(3000).queue(function(){
                $('.app-view-controller').css('padding-top', '60px');
                $('.connection-status').css('display', 'none').dequeue();
            });
        } else if (this.state.connectionStatus === 'offline') {
            $('.loader').css('display', 'none');
             $('.connection-icon').html('close');
            $('.connection-status').css('display', 'flex').css('background-color', '#FC461E');
        } else if (this.state.connectionStatus === 'connecting') {
            $('.loader').css('display', 'inline');
            $('.connection-icon').html('');
            $('.connection-status').css('background-color', '#FFCA28');
        };
        
        if ($('.connection-status').css('display') == 'flex') {
            $('.app-view-controller').css('padding-top', '90px');
        } else if ($('.connection-status').css('display') == 'none') {        
            $('.app-view-controller').css('padding-top', '60px');
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
		var styles = {};
		if(this.state.backgroundColor)
			styles.backgroundColor = this.state.backgroundColor;
		if(this.state.foregroundColor)
			styles.foregroundColor = this.state.foregroundColor;
		
		return (
			<div style={styles} className="top-bar-container">
				<div className="connection-status">
                <i className="material-icons connection-icon"></i>
                <div className="loader"></div>
                {status}
                </div>
				<div onClick={this.onMenuButton} className="menu-icon-container">
					<div className="menu-icon open"></div>
				</div>
				{/*<div onClick={this.onDualButton} className={"icon-dual-view-container " + openOrCloseButton}>
					<div className="icon-dual-view">
						<div className="box"></div>
						<div className="box"></div>
					</div>
				</div>*/}
			</div>
		);
	}
});

module.exports = Topbar;
