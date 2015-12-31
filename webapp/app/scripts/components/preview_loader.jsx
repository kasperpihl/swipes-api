var React = require('react');
var Reflux = require('reflux');

var userStore = require('../stores/UserStore');
var channelStore = require('../stores/ChannelStore');
var appStore = require('../stores/AppStore');
var previewAppStore = require('../stores/PreviewAppStore');
var stateStore = require('../stores/StateStore');

var PreviewLoader = React.createClass({
	mixins: [ previewAppStore.connect() ],
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

		if(this.state.obj){
			initObj.data.preview_obj = this.state.obj;
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
		this.loading = false;
		this.setState({loading:false});
		console.log("loaded iframe");
		this.sendPreviewObj();

	},
	sendPreviewObj: function(){
		console.log("sending preview", this.state.obj);
		var previewEv = {
			type: "preview",
			data: {
				preview_obj: this.state.obj
			}
		};
		if(this.apiCon)
			this.apiCon.callListener("event", previewEv);
	},
	renderLocalPreview:function(){
		if(!this.state.localPreview || this.state.app)
			return "";
		var Preview = this.state.localPreview;
		return <Preview data={{obj:this.state.obj}} />
	},
	renderLoading: function(){
		if(this.state.app && this.state.loading){
			return (
				<div className="preview-loader ">
					<div className="loader">
						<ul>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
						</ul>
					</div>
					<div className="loader-text">Loading</div>
				</div>
			);
		}
		return "";
	},
	componentWillUpdate: function(nextProps, nextState){
		if(nextState.url && this.state.url !== nextState.url){
			nextState.loading = true;
		}
	},
	componentDidUpdate: function(prevProps, prevState){
		if(this.state.app && this.state.obj != prevState.obj && !this.state.loading){
			this.sendPreviewObj()
		}
	},
	renderIframe:function(){
		if(!this.state.url)
			return "";
		var iframeClass = "app-frame-class ";
		if(this.state.loading)
			iframeClass += "hidden ";
		return <iframe ref="iframe" onLoad={this.onLoad} src={this.state.url} className={iframeClass} frameBorder="0"/>
	},
	render: function() {
		return (
			<div className="preview-wrapper">
				{this.renderLocalPreview()}
				{this.renderLoading()}
				{this.renderIframe()}
			</div>
		);
	}
});

module.exports = PreviewLoader;
