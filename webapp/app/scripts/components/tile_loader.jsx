var React = require('react');
var Reflux = require('reflux');
var objectAssign = require('object-assign');
// Node requires
var http = nodeRequire('http');
var https = nodeRequire('https');
var remote = nodeRequire('electron').remote;
var app = remote.app;
var path = nodeRequire('path');

var WorkflowStore = require('../stores/WorkflowStore');
var WorkspaceStore = require('../stores/WorkspaceStore');
var UserStore = require('../stores/UserStore');
var stateActions = require('../actions/StateActions');
var eventActions = require('../actions/EventActions');
var notificationActions = require('../actions/NotificationActions');

var workflowActions = require('../actions/WorkflowActions');
var userStore = require('../stores/UserStore');
var stateStore = require('../stores/StateStore');
var Services = require('./services');

var TileLoader = React.createClass({
	// Pass on a command through the communicator
	sendCommandToTile: function(command, data, callback){
		if(this.com){
			this.com.sendCommand(command, data, callback);
		}
	},

	componentDidMount() {
		this.callDelegate('tileDidLoad', this.props.data.id);
		this.addHandlersForWebview();
	},
	componentDidUpdate(prevProps, prevState) {
	    this.addHandlersForWebview();  
	},
	componentWillUnmount:function(){
		this.callDelegate('tileWillUnload', this.props.data.id);
	},
	onConnectNew: function(){
		eventActions.add("websocket_service_added", function(data){
			this.onSelectedAccount(data.data);
			eventActions.remove(null,null, "connect_service");
		}.bind(this), "connect_service");
	},
	onSelectedAccount: function(selectedAccount){
		workflowActions.selectAccount(this.state.workflow, selectedAccount.id);
	},
	render: function() {
		var workflowId = '';
		var cardContent = <div>Loading</div>;


		if(this.state.workflow){

			var url = this.state.workflow.index_url + '?id=' + this.state.workflow.id;
			workflowId = this.state.workflow.id;

			// For Kris
			// preload={'file://' + path.resolve(__dirname) + 'b\\swipes-electron\\preload\\tile-preload.js'}

			cardContent = <webview preload={'file://' + path.join(app.getAppPath(), 'preload/tile-preload.js')} src={url} ref="webview" className="workflow-frame-class"></webview>;

			// Determine if the
			if(this.state.workflow.required_services.length > 0){
				var requiredService = this.props.tile.required_services[0];
				var selectedAccountId = this.props.tile.selectedAccountId;
				var foundSelectedAccount = false;
				var connectedServices = _.filter(this.props.services, (service) => {
					if(service.service_name === requiredService){
						if(selectedAccountId && selectedAccountId === service.id){
							foundSelectedAccount = true;
							// K_TODO || T_TODO : WARNING, This is a super hack hahaha
							if(service.service_name === "slack" && service.authData){
								self.slackToken = service.authData.access_token;
							}
						}
						return true;
					}
					return false;
				});

				if(!this.state.workflow.selectedAccountId || !foundSelectedAccount){
					cardContent = <Services.SelectRow
						onConnectNew={this.onConnectNew}
						onSelectedAccount={this.onSelectedAccount}
						data={{
							services: connectedServices,
							title: this.state.workflow.required_services[0],
							manifest_id: this.state.workflow.required_services[0]
						}}
					/>
				}
			}
		}

		return (
			<div id={'tile-' + workflowId} className="tile">
				{this.renderDropOverlay()}
				{cardContent}
			</div>
		);
	}
});

module.exports = TileLoader;