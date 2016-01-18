var Reflux = require('reflux');
var sidebarActions = require('../actions/SidebarActions');
var modalActions = require('../actions/ModalActions');
var WorkflowStore = require('./WorkflowStore');
var SidebarStore = Reflux.createStore({
	listenables: [ sidebarActions ],
	onLoadWorkflowModal:function(){
		modalActions.loadModal("list", {"title": "Add a workflow", "emptyText": "We're working on adding more workflows.", "rows": WorkflowStore.getAll() }, function(row){
			if(row){
				swipes._client.callSwipesApi("users.addWorkflow", {"manifest_id": row.manifest_id}, function(res,error){
					if(res && res.ok){
						amplitude.logEvent('Engagement - Added Workflow', {'Workflow': row.manifest_id});
					}
					console.log("res from app", res);
				})
			}
		});
	}
});

module.exports = SidebarStore;