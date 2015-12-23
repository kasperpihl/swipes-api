var Reflux = require('reflux');

var AppStore = Reflux.createStore({
	localStorage: "AppStore",
	sort: "name",
	search:function(string, options){
		var results = [];
		this.each(function(app){
			var searchResult = {
				appId: "AAPP",
				text: app.name,
				id: app.id
			};
			if(app.name.toLowerCase().startsWith(string.toLowerCase())){
				results.push(searchResult);
			}
		})
		return {
			appId: "AAPP",
			name: "Apps",
			results: results
		};
	}
});

module.exports = AppStore;
