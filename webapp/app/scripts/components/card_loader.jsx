 var React = require('react');
var Reflux = require('reflux');
var objectAssign = require('object-assign');
var DragSource = require('react-dnd').DragSource;

var AppBar = require('material-ui/lib/app-bar');
var Badge = require('material-ui/lib/badge');
var IconButton = require('material-ui/lib/icon-button');
var FontIcon = require('material-ui/lib/font-icon');
var MenuItem = require('material-ui/lib/menus/menu-item');
var MoreVertIcon = require('material-ui/lib/svg-icons/navigation/more-vert');
var IconMenu = require('material-ui/lib/menus/icon-menu');

// Node requires
var http = nodeRequire('http');
var https = nodeRequire('https');

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
	}), WorkspaceStore.connectFilter('card', function(cards){
		return cards.filter(function(card) {
			return card.id === this.props.data.id;
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
				// K_TODO why we are doing this?
				//this.onMouseDown();
			}
			else if (message.command === "modal.load"){
				modalActions.loadModal(data.modal, data.options, callback);
			}
			else if (message.command === "actions.openURL"){
				window.open(data.url, "_blank");
				// cardActions.broadcast('request.preOpenUrl', {
				// 	url: data.url
				// }, function(list) {
				// 	if (list && list.length > 0) {
				// 		list.push({id: 'beproductive', name: 'New tab', new_tab: true});
				//
				// 		var modalData = {
				// 			title: "Open with",
				// 			emptyText: "Oops... something went wrong!",
				// 			rows: list
				// 		};
				//
				// 		modalActions.loadModal('list', modalData, function (row) {
				// 			if(row){
				// 				if (!row.new_tab) {
				// 					var newData = objectAssign({toCardId: row.id}, data);
				//
				// 					eventActions.fire("request.openUrl", newData);
				// 				} else {
				// 					window.open(data.url, "_blank");
				// 				}
				// 			}
				// 		});
				// 	} else {
				// 		window.open(data.url, "_blank");
				// 	}
				// })
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
				this.setState({badge: data.badge});
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
		var services = userStore.me().services || [];
		var slackToken = null;
		for(var i = 0 ; i < services.length ; i++){
			var serv = services[i];
			if(serv.service_name === "slack" && serv.authData){
				workflow.slackToken = serv.authData.access_token;
			}
		}


		var initObj = {
			type: "init",
			data: {
				manifest: workflow,
				slackToken: slackToken,
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
	onMouseDown: function(){
		workspaceActions.sendCardToFront(this.props.data.id);
	},
	onDragMouseDown:function( side, e){
		this.onMouseDown();
		// Add dragging class (preventing iframes from receiving mouse events)
		$('.active-app').addClass('resizing');
		this.side = side;
		this.isResizing = true;
		this.originalClientX = e.clientX;
		this.originalW = this.props.data.w;
		this.originalX = this.props.data.x;
		this.originalClientY = e.clientY;
		this.originalY = this.props.data.y;
		this.originalH = this.props.data.h;

		e.stopPropagation();
		e.preventDefault();
	},
	onMouseMove: function(e){
		if(this.isResizing){
			if(!e.which){
				return this.onMouseUp();
			}
			var diffX = (e.clientX - this.originalClientX);
			var diffY = (e.clientY - this.originalClientY);
			var newX, newY, newW, newH;
			if(['top', 'bottom'].indexOf(this.side) === -1){
				newW = diffX + this.originalW;

			}
			if(['left', 'right'].indexOf(this.side) === -1){
				newH = diffY + this.originalH;
			}

			if(['top', 'top-left', 'top-right'].indexOf(this.side) !== -1){
				newY = (this.originalY + diffY);
				newH = this.originalH - diffY;
			}
			if(['left', 'top-left', 'bottom-left'].indexOf(this.side) !== -1){
				newX = (this.originalX + diffX);
				newW = this.originalW - diffX;
			}

			var updateObj = {};
			if(newX)
				updateObj.x = newX;
			if(newY)
				updateObj.y = newY;
			if(newW)
				updateObj.w = newW;
			if(newH)
				updateObj.h = newH;
			//Actions.updateCardSize(this.props.data.id, updateObj);
			this.bouncedUpdateCardSize(this.props.data.id, updateObj);
		}
	},
	onMouseUp: function(e){
		if(this.isResizing){
			this.isResizing = false;
			$('.active-app').removeClass('resizing');
			workspaceActions.adjustForScreenSize();
		}
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
		// Load dropbox css
		var webview = this.refs.webview;

		if (webview) {
			var url = this.state.workflow.index_url;
			var splitURL = url.split('/').slice(0,-1).join('/');
			var cssContent = '';
			var jsContent = '';

			webview.addEventListener('dom-ready', () => {
				// webview.openDevTools();

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
					var that = this;
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
			webview.addEventListener('will-navigate', () => {
				this.setState({webviewLoading: true})
			})

			webview.addEventListener('did-navigate', () => {
				webview.insertCSS(cssContent);
			})

			webview.addEventListener('page-title-updated', () => {
				webview.executeJavaScript(jsContent);
			})
		}
	},
	renderWebviewLoader: function() {
		if(this.state.webviewLoading) {
			return (
				<div className="webview-loader">
					<Loading />
				</div>
			)
		}
	},
	componentWillMount() {
		this.bouncedUpdateCardSize = _.debounce(workspaceActions.updateCardSize, 1);
		eventActions.add("window.blur", this.onWindowBlur, "card" + this.props.data.id);
		eventActions.add("window.focus", this.onWindowFocus, "card" + this.props.data.id);
	  eventActions.add("window.mouseup", this.onMouseUp, "card" + this.props.data.id);
	  eventActions.add("window.mousemove", this.onMouseMove, "card" + this.props.data.id);
	},
	componentWillUnmount:function(){
		eventActions.remove(null, null, "card" + this.props.data.id);
	},
	onRenameWorkflow: function(){
		var newName = prompt('Rename workflow', this.state.workflow.name);
		if(newName){
			workflowActions.renameWorkflow(this.state.workflow, newName);
		}
	},
	onCardMenuButtonClick:function(){
		var e = {
			type: 'menu.button'
		};
		this.apiCon.callListener("event", e);
	},
	openCardMenu: function() {

		if (this.state.cardMenuState == 'active') {
			this.setState({cardMenuState: 'inactive'})
		} else {
			this.setState({cardMenuState: 'active'})
		}
	},
	renderAppbarLogo: function() {
		// T_TODO instead of spliting and slicing
		var url = this.state.workflow.index_url;
		var splitURL = url.split('/').slice(0,-1).join('/');

		if (this.state.workflow.icon) {
			return <img src={splitURL + '/' + this.state.workflow.icon} />
		}
	},
	renderCardBar: function(){
		if(!this.state.workflow)
			return;
		var title = this.state.workflow.name;
		if(this.state.titleFromCard){
			title = this.state.titleFromCard;
		}

		var titleObj = <span style={{cursor: 'pointer', padding: '20px 0'}} onTouchTap={this.onCardMenuButtonClick}>{title}</span>
		var fontObj = <FontIcon onTouchTap={this.onCardMenuButtonClick} className="material-icons">arrow_drop_down</FontIcon>;
		if(this.state.badge){
			fontObj = (<Badge
				onTouchTap={this.onCardMenuButtonClick}
				badgeContent={this.state.badge}
				style={{padding: 0, margin:0, cursor: 'pointer'}}
				badgeStyle={{backgroundColor: 'red', top: '14px', color:'white', right: 0, fontSize: '10px', paddingLeft: '3px', paddingRight: '3px', height: '20px', minWidth:'20px', width: 'auto'}}>
					<FontIcon  className="material-icons">arrow_drop_down</FontIcon>
				</Badge>);
		}

		return <div className="card-app-bar">
			<div className="card-actions">
				<div className="card-action close" onClick={workflowActions.removeWorkflow.bind(null, this.state.workflow)}>
					<FontIcon className="material-icons">close</FontIcon>
				</div>

				<div className="card-action minimize" onClick={workspaceActions.showHideCard.bind(null, this.state.workflow.id)}>
					<div className="minimize-icon"></div>
				</div>

				<div className="card-action maximize" onClick={workspaceActions.maximize.bind(null, this.state.workflow.id)}>
					<FontIcon className="material-icons">add</FontIcon>
				</div>
			</div>
			<div className="card-title" onClick={this.openCardMenu}>
				{titleObj}
				{fontObj}
			</div>
			<div className="card-icon">
				{this.renderAppbarLogo()}
			</div>
		</div>

	},
	renderCardMenu: function() {
		var title = this.state.workflow.name;
		return (
			<div className={"card-menu-overlay " + this.state.cardMenuState}>

			</div>
		)
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
		var className = (this.state.card && this.state.card.hoverDropOverlay) ? 'drop-overlay hover' : 'drop-overlay';

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
		var webviewLoader = <div />;
		var illuminatedCardId = WorkspaceStore.getIlluminatedCardId();
		var cardClass = 'card';

		var connectDragSource = this.props.connectDragSource;
		var connectDragPreview = this.props.connectDragPreview;
		var style = {
			position: 'absolute',
			zIndex: 1000
		};
		if(this.props.isDragging){
			style.display = 'none';
		}

		if(this.state.card){
			style.left = this.state.card.x;
			style.top = this.state.card.y;
			style.width = this.state.card.w;
			style.height = this.state.card.h;
			style.zIndex = 1000 + this.state.card.z;
			style.display = this.state.card.hidden ? 'none' : '';
		}
		if(this.state.workflow){
			var url = this.state.workflow.index_url + '?id=' + this.state.workflow.id;
			var externalUrl = this.state.workflow.external_url;
			workflowId = this.state.workflow.id;

			if (externalUrl) {
				cardContent = <webview ref="webview" src={externalUrl} className="workflow-frame-class"></webview>;
				webviewLoader = this.renderWebviewLoader();
			} else {
				cardContent = <iframe ref="iframe" sandbox="allow-scripts allow-same-origin allow-popups" onLoad={this.onLoad} src={url} className="workflow-frame-class" frameBorder="0"/>;
			}

			// Determine if the
			if(this.state.workflow.required_services){
				var requiredService = this.state.workflow.required_services[0];
				var selectedAccountId = this.state.workflow.selectedAccountId;
				var foundSelectedAccount = false;
				var connectedServices = _.filter(this.state.user.services, function(service){
					if(service.service_name === requiredService){
						if(selectedAccountId && selectedAccountId === service.id){
							foundSelectedAccount = true;
						}
						return true;
					}
					return false;
				});

				if(!externalUrl && (!this.state.workflow.selectedAccountId || !foundSelectedAccount)){
					cardContent = <Services.SelectRow onConnectNew={this.onConnectNew} onSelectedAccount={this.onSelectedAccount} data={{services: connectedServices, title: this.state.workflow.required_services[0], manifest_id: this.state.workflow.required_services[0]}} />
				}
			}
		}

		if (this.state.card && this.state.card.focused) {
			cardClass += ' focused';
		}

		if (illuminatedCardId) {
			cardClass += ' illumination'

			if (illuminatedCardId === workflowId) {
				cardClass += ' illuminated'
			}
		}

		return connectDragPreview(
			<div id={workflowId} className={cardClass} style={style} onMouseDown={this.onMouseDown}>

				<div className="card-container">

					<div className="resize-bar left" style={{zIndex:style.zIndex+1}} onMouseDown={this.onDragMouseDown.bind(this, 'left')}/>
					<div className="resize-bar right" style={{zIndex:style.zIndex+1}} onMouseDown={this.onDragMouseDown.bind(this, 'right')}/>
					<div className="resize-bar top" style={{zIndex:style.zIndex+1}} onMouseDown={this.onDragMouseDown.bind(this, 'top')}/>
					<div className="resize-bar bottom" style={{zIndex:style.zIndex+1}} onMouseDown={this.onDragMouseDown.bind(this, 'bottom')}/>
					<div className="resize-bar corner bottom-right" style={{zIndex:style.zIndex+1}} onMouseDown={this.onDragMouseDown.bind(this, 'bottom-right')}/>
					<div className="resize-bar corner bottom-left" style={{zIndex:style.zIndex+1}} onMouseDown={this.onDragMouseDown.bind(this, 'bottom-left')}/>
					<div className="resize-bar corner top-right" style={{zIndex:style.zIndex+1}} onMouseDown={this.onDragMouseDown.bind(this, 'top-right')}/>
					<div className="resize-bar corner top-left" style={{zIndex:style.zIndex+1}} onMouseDown={this.onDragMouseDown.bind(this, 'top-left')}/>
					{connectDragSource(this.renderCardBar())}
					<div className="card-content">
						{this.renderDropOverlay()}
						{cardContent}
						{webviewLoader}
					</div>
				</div>
			</div>
		);
	}
});



var cardSource = {
	beginDrag: function (props) {
		workspaceActions.resizeOnDrag(props.data.id);
		// Add dragging class (preventing iframes from receiving mouse events)
		$('.active-app').addClass('dragging');
		// Return the data describing the dragged item
		var item = { id: props.data.id };
		return item;
	},
	endDrag: function (props, monitor, component) {
		// Remove dragging class
		$('.active-app').removeClass('dragging');
		var item = monitor.getItem();
		var delta = monitor.getDifferenceFromInitialOffset();
    	var itemObj = WorkspaceStore.get(item.id);
    	WorkspaceStore.update(itemObj.id, {x: itemObj.x + delta.x, y: itemObj.y + delta.y});
        workspaceActions.adjustForScreenSize();
	}
};
function collect(connect, monitor) {
	return {
		// to let React DnD handle the drag events:
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		// You can ask the monitor about the current drag state:
		isDragging: monitor.isDragging()
	};
}


module.exports = DragSource('card', cardSource, collect)(CardLoader);
