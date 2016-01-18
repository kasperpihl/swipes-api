var Reflux = require('reflux');
var sidebarActions = require('../actions/SidebarActions');
var modalActions = require('../actions/ModalActions');
var WorkflowStore = require('./WorkflowStore');
var SidebarStore = Reflux.createStore({
	listenables: [ sidebarActions ],
	onLoadWorkflowModal:function(){
		swipes.api.request('workflows.list').then(function(res){
			modalActions.loadModal("list", {"title": "Add a workflow", "emptyText": "We're working on adding more workflows.", "rows": res.data }, function(row){
				if(row){
					swipes._client.callSwipesApi("users.addWorkflow", {"manifest_id": row.manifest_id}, function(res,error){
						if(res && res.ok){
							amplitude.logEvent('Engagement - Added Workflow', {'Workflow': row.manifest_id});
						}
						console.log("res from app", res);
					})
				}
			});
		}).catch(function(err){

		});
		
	}
});

module.exports = SidebarStore;