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

var CardLoader = React.createClass({
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
			cardMenuState: 'inactive',
			webviewLoading: true
		};
	},
	connectorHandleResponseReceivedFromListener: function(connector, message, callback){
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
				this.onMouseDown();
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
			else if(message.command === 'navigation.setBadge'){
				// this.setState({badge: data.badge});
				workspaceActions.setNotifications(this.state.workflow.id, data.badge);
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
				token: stateStore.get("swipesToken"),
				target_url: document.location.protocol + "//" + document.location.host
			}
		};
		if(this.state.workflow.selectedAccountId){
			initObj.data.selectedAccountId = this.state.workflow.selectedAccountId;
		}

		// Lazy instantiate
		if(!this.apiCon){
			this.apiCon = swipes._client.copyConnector();
		}
		this.apiCon.setId(this.state.workflow.id);
		var doc = this.refs.iframe.contentWindow;
		var apiUrl = this.apiCon.getBaseURL();
		this.apiCon.setListener(doc, apiUrl);
		this.apiCon.callListener("event", initObj);
		this.apiCon.setDelegate(this);
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
			this.apiCon.callListener("event", {type: 'app.focus'});
		}
	},
	onWindowBlur: function(e){
		if(this.apiCon){
			this.apiCon.callListener("event", {type: 'app.blur'});
		}
	},
	componentDidMount() {
		var that = this;
		var webview = this.refs.webview;

		if (webview) {
			var url = this.state.workflow.index_url;
			var splitURL = url.split('/').slice(0,-1).join('/');
			var cssContent = '';
			var jsContent = '';

			webview.addEventListener('dom-ready', () => {
				//webview.openDevTools();

				// Build this with promises
				if (splitURL.startsWith('https')) { // production env
					https.get(splitURL + '/styles/main.css').on('response', function (response) {
						response.on('data', function (chunk) {
			        cssContent += chunk;
			    	});

						response.on('end', function (chunk) {
							webview.insertCSS(cssContent);

              // just because there is a delay between injection and actually applying CSS, this is probably really dumb
							setTimeout(function(){
								that.setState({webviewLoading: false});
							}, 1000);
			    	});
					})

					https.get(splitURL + '/scripts/main.js').on('response', function (response) {
				    response.on('data', function (chunk) {
			        jsContent += chunk;
			    	});

						response.on('end', function (chunk) {
							webview.executeJavaScript(jsContent);
			    	});
					})
				} else { // Dev env
					http.get(splitURL + '/styles/main.css').on('response', function (response) {
				    response.on('data', function (chunk) {
			        cssContent += chunk;
			    	});

						response.on('end', function (chunk) {
							webview.insertCSS(cssContent);

              // just because there is a delay between injection and actually applying CSS, this is probably really dumb
							setTimeout(function(){
								that.setState({webviewLoading: false});
							}, 1000);
			    	});
					})

					http.get(splitURL + '/scripts/main.js').on('response', function (response) {
				    response.on('data', function (chunk) {
			        jsContent += chunk;
			    	});

						response.on('end', function (chunk) {
							webview.executeJavaScript(jsContent);
			    	});
					})
				}
			});
			webview.addEventListener('did-start-loading', () => {
				this.setState({webviewLoading: true})
			})

			webview.addEventListener('did-stop-loading', () => {
				console.log('stop loading');
				// just because there is a delay between injection and actually applying CSS, this is probably really dumb
				setTimeout(function(){
					that.setState({webviewLoading: false});
				}, 1000);
			})


			webview.addEventListener('did-navigate', () => {
				webview.insertCSS(cssContent);
			})

			webview.addEventListener('page-title-updated', () => {
				webview.executeJavaScript(jsContent);
			})
			// Handle analytics
			webview.addEventListener('ipc-message', (event) => {
			  var arg = event.args[0];

				if (event.channel === 'mixpanel') {
					mixpanel.track('Card Action', {
		        Card: arg.manifest_id,
		        Action: arg.action
		      });
				}
			});
		}
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
	renderTopbar: function() {

		return (
			<div className="tile-topbar">
				<div className="tile-topbar_content">
					<div className="tile-topbar_content-title">Chat</div>
					<div className="tile-topbar_content-seperator"></div>
					<div className="tile-topbar_content-account">Swipes Team</div>
				</div>
				<div className="tile-topbar_actions">
					<div className="tile-topbar_actions-collapse" onClick={this.props.onFullscreen}></div>
					<div className="tile-topbar_actions-fullscreen" onClick={workflowActions.removeWorkflow.bind(null, this.state.workflow)}></div>
				</div>
			</div>
		)
	},
	renderResizingOverlay: function() {

		return (
			<div className="tile-resizing-overlay">

			</div>
		)
	},
	render: function() {
		var workflowId = '';
		var cardContent = <Loading />;
		var webviewLoader = <div />;


		if(this.state.workflow){
			var url = this.state.workflow.index_url + '?id=' + this.state.workflow.id;
			var externalUrl = this.state.workflow.external_url;
			workflowId = this.state.workflow.id;

			if (externalUrl) {
				cardContent = <webview
					preload={'file://' + path.join(app.getAppPath(), 'preload/' + this.state.workflow.manifest_id + '.js')}
					ref="webview"
					src={externalUrl}
					className="workflow-frame-class">
				</webview>;
				// webviewLoader = this.renderWebviewLoader();
			} else {
				cardContent = <iframe ref="iframe" sandbox="allow-scripts allow-same-origin allow-popups" onLoad={this.onLoad} src={url} className="workflow-frame-class" frameBorder="0"/>;
			}

			// Determine if the
			if(this.state.workflow.required_services){
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

				if(!externalUrl && (!this.state.workflow.selectedAccountId || !foundSelectedAccount)){
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
				{this.renderTopbar()}
				{cardContent}
				{this.renderResizingOverlay()}
				{/*webviewLoader*/}
			</div>
		);
	}
});



module.exports = CardLoader;
