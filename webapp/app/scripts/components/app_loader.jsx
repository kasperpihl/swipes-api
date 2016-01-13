var React = require('react');
var stateStore = require('../stores/StateStore');
var Reflux = require('reflux');
var stateActions = require('../actions/StateActions');
var modalActions = require('../actions/ModalActions');
var eventActions = require('../actions/EventActions');

var userStore = require('../stores/UserStore');
var appStore = require('../stores/AppStore');

var AppLoader = React.createClass({
	mixins: [ Reflux.ListenerMixin ],
	onStateChange:function(states){
		var appForThisLoader = states["screen" + this.props.data.screen];
		if(appForThisLoader !== this.state){
			if(!appForThisLoader)
				appForThisLoader = {};
			this.replaceState(appForThisLoader);
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
			else if (message.command === "getData") {
				if(data.query && data.query.table){
					var store;
					switch(data.query.table){
						case "users":
							store = userStore;
							break;
						case "apps":
							store = appStore;
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
		if(this.state.app)
			amplitude.logEvent('Session - Opened Workflow', {'Workflow': this.state.app.manifest_id});

		eventActions.remove(null,null, "screen" + this.props.data.screen);
		var initObj = {
			type: "init",
			data: {
				manifest: this.state.app,
				user_id: userStore.me().id,
				token: stateStore.get("swipesToken"),
				target_url: document.location.protocol + "//" + document.location.host,
				default_scope: this.state.app.id
			}
		};

		// Lazy instantiate
		if(!this.apiCon){
			this.apiCon = swipes._client.copyConnector();
		}
		this.apiCon.setAppId(this.state.app.manifest_id);
		var doc = $(this.refs.iframe)[0].contentWindow;
		var apiUrl = this.apiCon.getBaseURL();
		this.apiCon.setListener(doc, apiUrl);
		this.apiCon.callListener("event", initObj);
		this.apiCon.setDelegate(this);
	},
	render: function() {
		if(!this.state.app) {
			return ( <div>Loading.</div> );
		}

		return (
			<iframe ref="iframe" onLoad={this.onLoad} src={this.state.url} className="app-frame-class" frameBorder="0"/>
		);
	}
});

module.exports = AppLoader;
