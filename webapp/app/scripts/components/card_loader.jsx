var React = require('react');
var Reflux = require('reflux');

var Loading = require('./loading');
var WorkflowStore = require('../stores/WorkflowStore');

var stateActions = require('../actions/StateActions');
var modalActions = require('../actions/ModalActions');
var eventActions = require('../actions/EventActions');

var userStore = require('../stores/UserStore');
var stateStore = require('../stores/StateStore');

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
			if (message.command === "modal.load"){
				modalActions.loadModal(data.modal, data.options, callback);
			}
			else if (message.command === "actions.openURL"){
				window.open(data.url, "_blank");
			}
			else if (message.command === 'analytics.action'){
				if(this.state.workflow){
					amplitude.logEvent('Engagement - Workflow Action', {'Workflow': this.state.workflow.manifest_id, 'Action': data.name});
				}
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
	render: function() {
		
		if(!this.state.workflow) {
			return ( <Loading /> );
		}
		var url = this.state.workflow.index_url + '?id=' + this.state.workflow.id;
		return (				
			<div className="card-container">
				<div className="card-top-bar">{this.state.workflow.name}</div>
				<iframe ref="iframe" sandbox="allow-scripts allow-same-origin" onLoad={this.onLoad} src={url} className="workflow-frame-class" frameBorder="0"/>
			</div>
		);
	}
});

module.exports = CardLoader;
