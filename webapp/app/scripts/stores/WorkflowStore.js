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
	onRenameWorkflow: function(workflow, name){
		swipes.api.request('users.renameWorkflow', {'workflow_id': workflow.id, name: name}, function(res, error){

		})
	},
	onSelectAccount:function(workflow, accountId){
		this.update(workflow.id, {selectedAccountId: accountId});
		swipes.api.request('users.selectWorkflowAccountId', {"workflow_id": workflow.id, "account_id": accountId}, function(res, error){
		});
	},
	onRemoveWorkflow: function(workflow){
		swipes.api.request("users.removeWorkflow", {"workflow_id": workflow.id}, function(res,error){
			if(res && res.ok){
				amplitude.logEvent('Engagement - Removed Workflow', {'Workflow': workflow.manifest_id});
				mixpanel.track('Removed Card', {'Card': workflow.manifest_id})
			}
			console.log("res from app", res);
		})
	},
	beforeSaveHandler:function(newObj){
		if(!newObj.index_url && newObj.index){
			newObj.index_url = this.workflow_base_url + newObj.manifest_id + '/' + newObj.index;
		}

		if(!newObj.icon_url && newObj.icon){
			var indexUrl = newObj.index_url;
			var splitURL = indexUrl.split('/').slice(0,-1).join('/');
			var icon = newObj.icon;

			newObj.icon_url = splitURL + '/' + icon;
		}

		return newObj;
	}
});

module.exports = WorkflowStore;
