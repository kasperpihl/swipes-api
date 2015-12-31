var Reflux = require('reflux');
var previewAppActions = require('../actions/PreviewAppActions');

var Previews = require('../components/previews/previews');
var appStore = require('./AppStore');

var PreviewAppStore = Reflux.createStore({
	listenables: [ previewAppActions ],
	onLoadPreview: function(item){
		var app = appStore.get(item.appId);
		this.set('obj', item, {trigger:false});
		if (app && app.preview_view_url) {
			this.set("app", app, {trigger:false});
			this.set("url", app.preview_view_url);
		}
		else{
			this.unset("app");
			this.unset("url");
			var Preview = Previews.default;
			if(item.appId === "AUSER"){
				Preview = Previews.user;
			}
			this.set('localPreview', Preview);
		}
		
	}


});
module.exports = PreviewAppStore;
