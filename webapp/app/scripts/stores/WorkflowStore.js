var Reflux = require('reflux');
var workflowActions = require('../actions/WorkflowActions');

var WorkflowStore = Reflux.createStore({
	listenables: [ workflowActions ],
	localStorage: "WorkflowStore",
	sort: "name",
	onSelectAccount:function(workflow, accountId){
		this.update(workflow.id, {selectedAccountId: accountId});
		swipesApi.request('users.selectWorkflowAccountId', {"workflow_id": workflow.id, "account_id": accountId}, function(res, error){
		});
	},
	beforeSaveHandler:function(newObj){
		if(!newObj.index_url && newObj.index){
			newObj.index_url = this.workflow_base_url + newObj.manifest_id + '/' + newObj.index;
		}

		var indexUrl = newObj.index_url;
		var splitURL = indexUrl.split('/').slice(0,-1).join('/');

		if(!newObj.icon_url && newObj.icon){
			var icon = newObj.icon;

			newObj.icon_url = splitURL + '/' + icon;
		}

		return newObj;
	}
});

module.exports = WorkflowStore;
