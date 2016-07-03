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

var Webview = require('react-electron-webview');
console.log(Webview);

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

			webview.addEventListener('dom-ready', this.onDomReady);

			webview.addEventListener('ipc-message', (event) => {
				var arg = event.args[0];
				this.apiCon.receivedMessage(arg);
				
			});
			webview.addEventListener('console-message', (e, stuff) => {
			  //console.log('Tile:', e, stuff);
			});
		}
		this.setState({webviewLoaded: true});
	},
	communicatorSendMessage(com, message){
		var webview = this.refs.webview;
		webview.send('message', message);
	},
	
	communicatorReceivedMessage: function(com, message, callback){
		var self = this,
				data, userInfo;

		if (message && message.command) {
			data = message.data;
			if (message.command === "navigation.setTitle") {
				if (data.title) {
					this.setState({"titleFromCard": data.title});
				}
			}
			else if (message.command === "event.focus"){
				//this.onMouseDown();
			}
			else if (message.command === "modal.load"){
				modalActions.loadModal(data.modal, data.options, callback);
			}
			else if (message.command === "actions.openURL"){
				window.open(data.url, "_blank");
			}
			else if (message.command === "actions.startDrag"){
				var newData = {
					fromCardId: this.props.data.id,
					data: data
				};

				this.props.dotDragBegin(newData, callback);
			}
			else if (message.command === "share.request") {
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
								data: message.data
							});
						}
					});
				});
			}
			else if (message.command === 'analytics.action'){
				if(this.state.workflow){
					var analyticsProps = {'Card': this.state.workflow.manifest_id, 'Action': data.name};
					amplitude.logEvent('Engagement - Workflow Action', analyticsProps);
					mixpanel.track('Card Action', analyticsProps);

				}
			}
			else if(message.command === 'leftNav.load'){
				leftNavActions.load(data, callback);
			}
			else if(message.command === 'notifications.send'){

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
			else if (message.command === "listenTo") {
				eventActions.add("websocket_" + data.event, this.receivedSocketEvent, "card" + this.props.data.id);

				//return this.listeners[data.event] = connector;
			}
		}
	},
	receivedSocketEvent: function(e){
		if(this.apiCon){
			this.apiCon.callListener("event", e);
		}
	},
	onShareInit: function (e) {
		if (e.toCardId === this.props.data.id) {
			this.apiCon.callListener('event', {
				type: 'share.init',
				data: e
			}, e.callback);
		}
	},
	onShareTransmit: function (e) {
		if (e.toCardId === this.props.data.id) {
			var analyticsProps = {from: WorkflowStore.get(e.fromCardId).manifest_id, to: this.state.workflow.manifest_id};
			amplitude.logEvent('Engagement - Share Action', analyticsProps);
			mixpanel.track('Share Action', analyticsProps);
			this.apiCon.callListener('event', {
				type: 'share.transmit',
				data: e
			});
		}
	},
	onRequestPreOpenUrl: function (e) {
		if (e.toCardId === this.props.data.id) {
			this.apiCon.callListener('event', {
				type: 'request.preOpenUrl',
				data: e
			}, e.callback);
		}
	},
	onRequestOpenUrl: function (e) {
		if (e.toCardId === this.props.data.id) {
			this.apiCon.callListener('event', {
				type: 'request.openUrl',
				data: e
			});
		}
	},
	onLoad:function(){
		// Clear any listeners for this card.
		eventActions.remove(null, null, "card" + this.props.data.id);

		// Add a listeners for share
		eventActions.add("share.init", this.onShareInit, "card" + this.props.data.id);
		eventActions.add("share.transmit", this.onShareTransmit, "card" + this.props.data.id);
		eventActions.add("share.ondrop", this.onShareTransmit, "card" + this.props.data.id);
		eventActions.add("request.preOpenUrl", this.onRequestPreOpenUrl, "card" + this.props.data.id);
		eventActions.add("request.openUrl", this.onRequestOpenUrl, "card" + this.props.data.id);

		var workflow = this.state.workflow;

		// K_TODO || T_TODO : WARNING, This is a super hack hahaha
		if(workflow && this.slackToken){
			workflow.slackToken = this.slackToken;
		}


		var initObj = {
			type: "init",
			data: {
				manifest: workflow,
				_id: this.state.workflow.id,
				user_id: userStore.me().id,
				token: stateStore.get("swipesToken")
			}
		};
		if(this.state.workflow.selectedAccountId){
			initObj.data.selectedAccountId = this.state.workflow.selectedAccountId;
		}

		// Lazy instantiate
		if(!this.apiCon){
			this.apiCon = new SwClientCom(this);
		}
		this.apiCon.sendMessage(initObj);
	},
	postMessage(data){
		this.refs.webview.send('message', data);
	},
	onDragMouseDown:function( side, e){
		// Add dragging class (preventing iframes from receiving mouse events)
		$('.active-app').addClass('resizing');
		this.side = side;
		this.isResizing = true;
		this.originalClientX = e.clientX;
		this.originalClientY = e.clientY;

		e.stopPropagation();
		e.preventDefault();
	},
	onWindowFocus: function(e){
		if(this.apiCon){
			this.apiCon.sendMessage({type: 'app.focus'});
		}
	},
	onWindowBlur: function(e){
		if(this.apiCon){
			this.apiCon.sendMessage({type: 'app.blur'});
		}
	},
	componentDidMount() {
		this.addHandlersForWebview();
	},
	componentDidUpdate(prevProps, prevState) {
	    this.addHandlersForWebview();  
	},
	componentWillMount() {
		eventActions.add("window.blur", this.onWindowBlur, "card" + this.props.data.id);
		eventActions.add("window.focus", this.onWindowFocus, "card" + this.props.data.id);
	},
	componentWillUnmount:function(){
		eventActions.remove(null, null, "card" + this.props.data.id);
	},
	onMouseEnterDropOverlay: function () {
		if (this.state.workflow) {
			var id = this.state.workflow.id;

			workspaceActions.enterLeaveDropOverlay(id, true);
			this.props.onEnterLeaveDropOverlay(id);
		};
	},
	onMouseLeaveDropOverlay: function () {
		if (this.state.workflow) {
			var id = this.state.workflow.id;

			workspaceActions.enterLeaveDropOverlay(id, false);
		};

		this.props.onEnterLeaveDropOverlay(null);
	},
	renderDropOverlay: function(){
		var title = "";
		// Make this in a different way, card is no longer available here. All unique properties should be in workflow.
		//var className = (this.state.card && this.state.card.hoverDropOverlay) ? 'drop-overlay hover' : 'drop-overlay';
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
	onDomReady(e){
		this.onLoad();
	},
	render: function() {
		var workflowId = '';
		var cardContent = <Loading />;
		var webviewLoader = <div />;


		if(this.state.workflow){
			var url = this.state.workflow.index_url + '?id=' + this.state.workflow.id;
			workflowId = this.state.workflow.id;
			console.log('url', url);
			// For Tiho
			// preload={'file://' + path.join(app.getAppPath(), 'preload/tile-preload.js')}
			// For Kris
			// preload={'file://' + path.resolve(__dirname) + 'b\\swipes-electron\\preload\\tile-preload.js'}
			cardContent = <webview preload={'file://' + path.join(app.getAppPath(), 'preload/tile-preload.js')} src={url} ref="webview" className="workflow-frame-class"></webview>
			//cardContent = <iframe ref="iframe" sandbox="allow-scripts allow-same-origin allow-popups" onLoad={this.onLoad} src={url} className="workflow-frame-class" frameBorder="0"/>;

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
			<div id={workflowId} className="tile">
				{this.renderDropOverlay()}
				{cardContent}
				{/*webviewLoader*/}
			</div>
		);
	}
});



module.exports = TileLoader;
