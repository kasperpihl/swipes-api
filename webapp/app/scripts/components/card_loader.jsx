var React = require('react');
var Reflux = require('reflux');

var Loading = require('./loading');
var WorkflowStore = require('../stores/WorkflowStore');

var stateActions = require('../actions/StateActions');
var modalActions = require('../actions/ModalActions');
var eventActions = require('../actions/EventActions');
var topbarActions = require('../actions/TopbarActions');
var workflowActions = require('../actions/WorkflowActions');

var userStore = require('../stores/UserStore');
var stateStore = require('../stores/StateStore');

var AppBar = require('material-ui/lib').AppBar;
var Badge = require('material-ui/lib').Badge;
var IconButton = require('material-ui/lib').IconButton;
var FontIcon = require('material-ui/lib').FontIcon;
var MenuItem = require('material-ui/lib/menus/menu-item');
var IconMenu = require('material-ui/lib/menus/icon-menu');


var leftNavActions = require('../actions/LeftNavActions');

var CardLoader = React.createClass({
	mixins: [ WorkflowStore.connectFilter('workflow', function(workflows){
		return workflows.filter(function(workflow) {
			return workflow.id === this.props.data.id;
		}.bind(this))[0];
	}) ],
	getInitialState:function(){
		return {};
	},
	connectorHandleResponseReceivedFromListener: function(connector, message, callback){
		var data, userInfo;
		if (message && message.command) {
			data = message.data;
			if (message.command === "navigation.setTitle") {
				if (data.title) {
					this.setState({"titleFromCard": data.title});
				}
			}
			else if (message.command === "modal.load"){
				modalActions.loadModal(data.modal, data.options, callback);
			}
			else if (message.command === "actions.openURL"){
				window.open(data.url, "_blank");
			}
			else if(message.command === "actions.share"){
				// K_TODO: this should load a share overlay, rendering all the actions from the cards.
				// After selection, it should callback:
				// this.apiCon.callListener('event', { type: 'share'})
			}
			else if (message.command === 'analytics.action'){
				if(this.state.workflow){
					amplitude.logEvent('Engagement - Workflow Action', {'Workflow': this.state.workflow.manifest_id, 'Action': data.name});
				}
			}
			else if(message.command === 'leftNav.load'){
				leftNavActions.load(data, callback);
			}
			else if(message.command === 'navigation.setBadge'){
				this.setState({badge: data.badge});
			}
			else if (message.command === "listenTo") {
				eventActions.add("websocket_" + data.event, this.receivedSocketEvent, "card" + this.props.data.id);

				//return this.listeners[data.event] = connector;
			}
		}
	},
	receivedSocketEvent: function(e){
		console.log("received socket event", e);
		this.apiCon.callListener("event", e);
	},
	onLoad:function(){
		// Clear any listeners for this card.
		eventActions.remove(null, null, "card" + this.props.data.id);

		var initObj = {
			type: "init",
			data: {
				manifest: this.state.workflow,
				_id: this.state.workflow.id,
				user_id: userStore.me().id,
				token: stateStore.get("swipesToken"),
				target_url: document.location.protocol + "//" + document.location.host
			}
		};

		// Lazy instantiate
		if(!this.apiCon){
			this.apiCon = swipes._client.copyConnector();
		}
		this.apiCon.setId(this.state.workflow.id);
		var doc = $(this.refs.iframe)[0].contentWindow;
		var apiUrl = this.apiCon.getBaseURL();
		this.apiCon.setListener(doc, apiUrl);
		this.apiCon.callListener("event", initObj);
		this.apiCon.setDelegate(this);
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
	renderCardBar: function(){
		var iconMenu = (<IconMenu
			iconButtonElement={<IconButton
				touch={true}><FontIcon color="white" className="material-icons">arrow_drop_down</FontIcon></IconButton>}
			targetOrigin={{horizontal: 'right', vertical: 'top'}}
			anchorOrigin={{horizontal: 'left', vertical: 'top'}}>
			<MenuItem primaryText="Rename" onTouchTap={this.onRenameWorkflow} />
			<MenuItem primaryText="Remove" onTouchTap={workflowActions.removeWorkflow.bind(null, this.state.workflow)} />
		</IconMenu>);

		var menuButton = menu = <IconButton style={{}} 
			touch={true} onTouchTap={this.onCardMenuButtonClick}>
			<FontIcon color="white" className="material-icons">menu</FontIcon>
		</IconButton>;
		
		if(this.state.badge){
			menu = (<Badge
				badgeContent={this.state.badge}
				style={{padding: 0, margin:0}}
				badgeStyle={{backgroundColor: 'red', top: 3, color:'white', right: 3, fontSize: '10px', paddingLeft: '3px', paddingRight: '3px', height: '20px', minWidth:'20px', width: 'auto'}}>
					{menuButton}
				</Badge>);
		}
		var title = this.state.workflow.name;
		if(this.state.titleFromCard){
			title = this.state.titleFromCard;
		}
		return <AppBar
			title={<span>{title}</span>}
			iconElementRight={iconMenu}
			iconElementLeft={menu}/>
	},
	render: function() {

		if(!this.state.workflow) {
			return ( <Loading /> );
		}
		var url = this.state.workflow.index_url + '?id=' + this.state.workflow.id;
		return (
			<div className="card-container">
				{this.renderCardBar()}
				<iframe ref="iframe" sandbox="allow-scripts allow-same-origin allow-popups" onLoad={this.onLoad} src={url} className="workflow-frame-class" frameBorder="0"/>
			</div>
		);
	}
});

module.exports = CardLoader;
