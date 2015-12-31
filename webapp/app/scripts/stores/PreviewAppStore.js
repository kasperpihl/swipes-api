var Reflux = require('reflux');
var PreviewAppActions = require('../actions/PreviewAppActions');
var Previews = require('../components/previews/previews');
var AppStore = require('./AppStore');

var PreviewAppStore = Reflux.createStore({
	listenables: [ PreviewAppActions ],
	onLoadPreview: function (item) {
		var app = AppStore.get(item.appId);

		this.set('obj', item, {trigger:false});

		if (app && app.preview_view_url) {
			this.set("app", app, {trigger:false});
			this.set("url", app.preview_view_url);
		}	else {
			this.unset("app");
			this.unset("url");

			var preview = Previews.default;

			if(item.appId === "AUSER"){
				preview = Previews.user;
			}
			if(item.appId === "AAPP"){
				preview = Previews.app;
			}
			if(item.appId === 'ACHANNEL'){
				preview = Previews.channel;
			}

			this.set('localPreview', preview);
		}
	}


});
module.exports = PreviewAppStore;
