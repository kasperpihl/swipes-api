var Reflux = require('reflux');

var WorkflowStore = Reflux.createStore({
	localStorage: "WorkflowStore",
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
			appId: "AWORKFLOW",
			name: "Workflows",
			results: results
		};
	}
});

module.exports = WorkflowStore;
