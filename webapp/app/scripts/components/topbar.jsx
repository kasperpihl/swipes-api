var React = require('react');

var Reflux = require('reflux');
var socketStore = require('../stores/SocketStore');
var topbarStore = require('../stores/TopbarStore');
var topbarActions = require('../actions/TopbarActions');
var Topbar = React.createClass({
	mixins: [ Reflux.ListenerMixin ],
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
                $('.workflow-view-controller').css('padding-top', '60px');
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
            $('.workflow-view-controller').css('padding-top', '90px');
        } else if ($('.connection-status').css('display') == 'none') {        
            $('.workflow-view-controller').css('padding-top', '60px');
        }
	},

	getInitialState: function(){
		return {};
	},
	componentWillMount: function(){
		this.listenTo(socketStore, this.onSocketChange, this.onSocketChange);
	},
	clickedAdd: function(){
		topbarActions.loadWorkflowModal();
	},
	render: function() {
		var status = "";
		if(this.state && this.state.connectionStatus)
			status = this.state.connectionStatus;

		
		return (
			<div className="top-bar-container">
				<div className="connection-status">
					<i className="material-icons connection-icon"></i>
					<div className="loader"></div>
					{status}
				</div>
				<div onClick={this.onMenuButton} className="menu-icon-container">
					<div className="menu-icon open"></div>
				</div>
				<h5>Workspace</h5>
				<div className="add-button" onClick={this.clickedAdd}>
					<i className="material-icons">library_add</i>
				</div>
			</div>
		);
	}
});

module.exports = Topbar;
