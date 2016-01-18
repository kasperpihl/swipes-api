var Reflux = require('reflux');
var WorkflowStore = Reflux.createStore({
	localStorage: "WorkflowStore",
	sort: "name",
	search:function(string, options){
		var results = [];
		this.each(function(app){
			var searchResult = {
				workflowId: "AAPP",
				text: app.name,
				id: app.id
			};
			if(app.name.toLowerCase().startsWith(string.toLowerCase())){
				results.push(searchResult);
			}
		})
		return {
			workflowId: "AWORKFLOW",
			name: "Workflows",
			results: results
		};
	},
	beforeSaveHandler:function(newObj){
		if(!newObj.index_url && newObj.index){
			newObj.index_url = this.workflow_base_url + newObj.manifest_id + '/' + newObj.index;
		}
		return newObj;
	}	
});

module.exports = WorkflowStore;
