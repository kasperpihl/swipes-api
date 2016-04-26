var Reflux = require('reflux');
var BridgeStore = Reflux.createStore({
	init: function(){
		window.BridgeStore = this;
	},
	callInit: function(){
		if(this.didInit){
			return;
		}
		this.didInit = true;
		this.setupWebViewJavascriptBridge(function(bridge){ 
			this.bridge = bridge;
			bridge.registerHandler("notification-clicked", function(data, responseCallback) {
				console.log('notification clicked');
				// Do something on handling notifications
			})

		}.bind(this));
	},
	callBridge:function(command, options, callback){
		if(this.bridge){
			this.bridge.callHandler(command, options, callback);
		}
	},
	setupWebViewJavascriptBridge(callback) {
		if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
		if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
		window.WVJBCallbacks = [callback];
		var WVJBIframe = document.createElement('iframe');
		WVJBIframe.style.display = 'none';
		WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
		document.documentElement.appendChild(WVJBIframe);
		setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
	}

});

module.exports = BridgeStore;