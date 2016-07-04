var React = require('react');
var Reflux = require('reflux');
var objectAssign = require('object-assign');
// Node requires
var http = nodeRequire('http');
var https = nodeRequire('https');
var remote = nodeRequire('electron').remote;
var app = remote.app;
var path = nodeRequire('path');

var Loading = require('./loading');
var WorkflowStore = require('../stores/WorkflowStore');
var WorkspaceStore = require('../stores/WorkspaceStore');
var UserStore = require('../stores/UserStore');
var stateActions = require('../actions/StateActions');
var modalActions = require('../actions/ModalActions');
var eventActions = require('../actions/EventActions');
var notificationActions = require('../actions/NotificationActions');
var topbarActions = require('../actions/TopbarActions');
var workflowActions = require('../actions/WorkflowActions');
var workspaceActions = require('../actions/WorkspaceActions');
var cardActions = require('../actions/CardActions');
var userStore = require('../stores/UserStore');
var stateStore = require('../stores/StateStore');
var leftNavActions = require('../actions/LeftNavActions');
var Services = require('./services');

var TileLoader = React.createClass({
	mixins: [ WorkflowStore.connectFilter('workflow', function(workflows){
		return workflows.filter(function(workflow) {
			return workflow.id === this.props.data.id;
		}.bind(this))[0];
	}), Reflux.connectFilter(UserStore, "user", function(users) {
		return users.filter(function(user) {
			return user.me;
		}.bind(this))[0];
	}) ],
	callDelegate(name){
		if(this.props.delegate && typeof this.props.delegate[name] === "function"){
			return this.props.delegate[name].apply(null, [this].concat(Array.prototype.slice.call(arguments, 1)));
		}
	},
	getInitialState:function(){
		return {
			webviewLoading: true,
			webviewLoaded: false
		};
	},
	addHandlersForWebview(){
		var webview = this.refs.webview;
		if(this.state.webviewLoaded)
			return;

		if (webview) {
			webview.addEventListener('dom-ready', this.onLoad);
			webview.addEventListener('ipc-message', (event) => {
				var arg = event.args[0];
				this.passReceivedMessageToCommunicator(arg);
			});
			webview.addEventListener('console-message', (e) => {
			  //console.log(e.line, e.message);
			});
		}
		this.setState({webviewLoaded: true});
	},
	sendCommandToTile: function(command, data, callback){
		if(this._com){
			this._com.sendMessage(command, data, callback);
		}
	},
	receivedCommandFromTile: function(command, data, callback){
		var self = this,
				data, userInfo;
		if (command) {
			if (command === "navigation.setTitle") {
				if (data.title) {
					this.setState({"titleFromCard": data.title});
				}
			}
			else if (command === "event.focus"){
				//this.onMouseDown();
			}
			else if (command === "modal.load"){
				modalActions.loadModal(data.modal, data.options, callback);
			}
			else if (command === "actions.openURL"){
				window.open(data.url, "_blank");
			}
			else if (command === "actions.startDrag"){
				var newData = {
					fromCardId: this.props.data.id,
					data: data
				};

				this.props.dotDragBegin(newData, callback);
			}
			else if (command === "share.request") {
				console.log('init share ffs');
				cardActions.broadcast('share.init', {
					sourceCardId: message._id
				}, function (list) {
					var modalData = {
						title: "Share to",
						emptyText: "Seems that you have one lonely card there. Add another one!",
						rows: list
					};

					modalActions.loadModal('list', modalData, function (row) {
						if(row){

							eventActions.fire("share.transmit", {
								fromCardId: self.state.workflow.id,
								toCardId: row.id,
								action: row.action,
								data: data
							});
						}
					});
				});
			}
			else if (command === 'analytics.action'){
				if(this.state.workflow){
					var analyticsProps = {'Card': this.state.workflow.manifest_id, 'Action': data.name};
					amplitude.logEvent('Engagement - Workflow Action', analyticsProps);
					mixpanel.track('Card Action', analyticsProps);

				}
			}
			else if(command === 'leftNav.load'){
				leftNavActions.load(data, callback);
			}
			else if(command === 'notifications.send'){

				var notification = {
					title: this.state.workflow.name,
					message: data.message
				};
				if(data.title){
					notification.title += ": " + data.title;
				}
				if(!document.hasFocus()) {
					notificationActions.send(notification);
				}
			}
			else if (command === "listenTo") {
				eventActions.add("websocket_" + data.event, this.receivedSocketEvent, "card" + this.props.data.id);

				//return this.listeners[data.event] = connector;
			}
		}
	},
	receivedSocketEvent: function(e){
		// K_TODO, fix this somehow
		this.sendCommandToTile(e);
	},
	onLoad:function(){
		var workflow = this.state.workflow;

		// K_TODO || T_TODO : WARNING, This is a super hack hahaha
		if(workflow && this.slackToken){
			workflow.slackToken = this.slackToken;
		}

		var initObj = {
			manifest: workflow,
			_id: this.state.workflow.id,
			user_id: userStore.me().id,
			token: stateStore.get("swipesToken")
		};
		if(this.state.workflow.selectedAccountId){
			initObj.selectedAccountId = this.state.workflow.selectedAccountId;
		}

		// Lazy instantiate
		var target = {postMessage: function(data){ this.refs.webview.send('message', data); }.bind(this)};
		this._com = new SwClientCom(this, target, initObj);

	},

	onWindowFocus: function(e){
		this.sendCommandToTile('app.focus');
	},
	onWindowBlur: function(e){
		this.sendCommandToTile('app.blur');
	},
	passReceivedMessageToCommunicator(message){
		this._com.receivedMessageFromTarget(message);
	},
	
	handleReceivedMessage: function(message, callback){
		var command = message.command;
		var data = message.data;
		this.receivedCommandFromTile(command, data, callback);
	},
	componentDidMount() {
		this.addHandlersForWebview();

		eventActions.add("window.blur", this.onWindowBlur, "card" + this.props.data.id);
		eventActions.add("window.focus", this.onWindowFocus, "card" + this.props.data.id);
		this.callDelegate('tileDidLoad', this.props.data.id);
	},
	componentDidUpdate(prevProps, prevState) {
	    this.addHandlersForWebview();  
	},
	componentWillUnmount:function(){
		this.callDelegate('tileWillUnload', this.props.data.id);
		eventActions.remove(null, null, "card" + this.props.data.id);
	},
	renderDropOverlay: function(){
		var title = "";

		var className = 'drop-overlay';
		if (this.state.workflow) {
			title = this.state.workflow.name;
		}

		return (
			<div
				className={className}
				onMouseEnter={this.onMouseEnterDropOverlay}
				onMouseLeave={this.onMouseLeaveDropOverlay}
			>
				<h6>Share to {title}</h6>
			</div>
		);
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
		var cardContent = <Loading />;


		if(this.state.workflow){

			var url = this.state.workflow.index_url + '?id=' + this.state.workflow.id;
			workflowId = this.state.workflow.id;
			// For Tiho
			// preload={'file://' + path.join(app.getAppPath(), 'preload/tile-preload.js')}
			// For Kris
			// preload={'file://' + path.resolve(__dirname) + 'b\\swipes-electron\\preload\\tile-preload.js'}

			cardContent = <webview preload={'file://' + path.join(app.getAppPath(), 'preload/tile-preload.js')} src={url} ref="webview" className="workflow-frame-class"></webview>;

			// Determine if the
			if(this.state.workflow.required_services.length > 0){
				var requiredService = this.state.workflow.required_services[0];
				var selectedAccountId = this.state.workflow.selectedAccountId;
				var foundSelectedAccount = false;
				var self = this;
				var connectedServices = _.filter(this.state.user.services, function(service){
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