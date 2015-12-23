var React = require('react');
var Reflux = require('reflux');

var userStore = require('../stores/UserStore');
var channelStore = require('../stores/ChannelStore');
var appStore = require('../stores/AppStore');
var stateStore = require('../stores/StateStore');

var PreviewLoader = React.createClass({
	mixins: [ Reflux.ListenerMixin ],
	onStateChange:function(states){
		var appForThisLoader = states["preview" + this.props.data.preview];
		if(appForThisLoader !== this.state){
			if(!appForThisLoader)
				appForThisLoader = {};
			this.replaceState(appForThisLoader);
		}
	},
	componentWillMount: function(){
		this.listenTo(stateStore, this.onStateChange, this.onStateChange);
	},
	getInitialState:function(){
		return {};
	},
	connectorHandleResponseReceivedFromListener: function(connector, message, callback){
		var data, userInfo;
		if (message && message.command) {
			data = message.data;
			if (message.command === "getData") {
				if(data.query && data.query.table){
					var store;
					switch(data.query.table){
						case "users":
							store = userStore;
							break;
						case "channels":
							store = channelStore;
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
		}
	},
	onLoad:function(){
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
		
		if(this.state.previewObj){
			initObj.data.preview_obj = this.state.previewObj;
		}
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
		console.log("render iframe for preview", this.state);
		if(!this.state.app) {
			return ( <div>Loading</div> );
		}

		return (
			<iframe ref="iframe" onLoad={this.onLoad} src={this.state.url} className="app-frame-class" frameBorder="0"/>
		);
	}
});

module.exports = PreviewLoader;
