var React = require('react');
var stateStore = require('../stores/StateStore');
var Reflux = require('reflux');
var stateActions = require('../actions/StateActions');
var modalActions = require('../actions/ModalActions');
var eventActions = require('../actions/EventActions');

var userStore = require('../stores/UserStore');
var WorkflowStore = require('../stores/WorkflowStore');

var WorkflowLoader = React.createClass({
	mixins: [ Reflux.ListenerMixin ],
	onStateChange:function(states){
		var workflowForThisLoader = states["screen" + this.props.data.screen];
		if(workflowForThisLoader !== this.state){
			if(!workflowForThisLoader)
				workflowForThisLoader = {};
			this.replaceState(workflowForThisLoader);
		}
	},
	componentWillMount: function(){
		this.listenTo(stateStore, this.onStateChange, this.onStateChange);
	},
	componentWillUnmount:function(){
		eventActions.remove(null, null, "screen" + this.props.data.screen);
	},
	getInitialState:function(){
		return {};
	},
	connectorHandleResponseReceivedFromListener: function(connector, message, callback){
		var data, userInfo;
		if (message && message.command) {
			data = message.data;
			if (message.command === "navigation.setTitle") {
				if (data.title) {
					stateActions.setTopbarTitle(this.props.data.screen, data.title);
				}
			}
			else if (message.command === "navigation.setBackgroundColor") {
				if(this.props.data.screen === 1)
					stateActions.changeBackgroundColor(data.color);

			}
			else if (message.command === "navigation.setForegroundColor") {
				if(this.props.data.screen === 1)
					stateActions.changeForegroundColor(data.color);
			}
			else if (message.command === "navigation.enableBoxShadow") {
				if(this.props.data.screen === 1){
					stateActions.setTopbarTitle(this.props.data.screen, data.title);
				}
			}
			else if (message.command === "modal.load"){
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
			else if (message.command === "getData") {
				if(data.query && data.query.table){
					var store;
					switch(data.query.table){
						case "users":
							store = userStore;
							break;
						case "workflows":
							store = WorkflowStore;
							break;
					}

					if(!store)
						return callback(false, "Query must include valid table");
					if(data.query.id)
						return callback(store.get(data.query.id));
					return callback(store.get());
				}
			}
			else if (message.command === "listenTo") {
				eventActions.add("websocket_" + data.event, this.receivedSocketEvent, "screen" + this.props.data.screen);

				//return this.listeners[data.event] = connector;
			}
		}
	},
	receivedSocketEvent: function(e){
		console.log("received socket event", e);
		this.apiCon.callListener("event", e);
	},
	onLoad:function(){
		if(this.state.workflow)
			amplitude.logEvent('Session - Opened Workflow', {'Workflow': this.state.workflow.manifest_id});

		eventActions.remove(null,null, "screen" + this.props.data.screen);
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
	render: function() {
		if(!this.state.workflow) {
			return ( <div>Loading.</div> );
		}
		var url = this.state.url + '?id=' + this.state.workflow.id;
		return (
			<iframe ref="iframe" sandbox="allow-scripts allow-same-origin" onLoad={this.onLoad} src={url} className="workflow-frame-class" frameBorder="0"/>
		);
	}
});

module.exports = WorkflowLoader;
