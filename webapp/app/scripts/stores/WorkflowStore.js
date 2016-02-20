var Reflux = require('reflux');
var workflowActions = require('../actions/WorkflowActions');

var WorkflowStore = Reflux.createStore({
	listenables: [ workflowActions ],
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
	shareList: function () {
		var list = [];
		var workflows = this.getAll();

		workflows.forEach(function (wf) {
			if (wf.share_actions && wf.share_actions.length > 0) {
				wf.share_actions.forEach(function (action) {
					var item = {
						name: wf.name + ' - ' + action,
						id: wf.id,
						action: action
					}

					list.push(item);
				})
			}
		});

		return list;
	},
	onRenameWorkflow: function(workflow, name){
		swipes.api.request('users.renameWorkflow', {'workflow_id': workflow.id, name: name}, function(res, error){

		})
	},
	onRemoveWorkflow: function(workflow){
		swipes.api.request("users.removeWorkflow", {"workflow_id": workflow.id}, function(res,error){
			if(res && res.ok){
				amplitude.logEvent('Engagement - Removed Workflow', {'Workflow': workflow.manifest_id});
			}
			console.log("res from app", res);
		})
	},
	beforeSaveHandler:function(newObj){
		if(!newObj.index_url && newObj.index){
			newObj.index_url = this.workflow_base_url + newObj.manifest_id + '/' + newObj.index;
		}
		return newObj;
	}
});

module.exports = WorkflowStore;
