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
					swipes.api.request("users.addWorkflow", {"manifest_id": row.manifest_id}, function(res,error){
						if(res && res.ok){
							amplitude.logEvent('Engagement - Added Workflow', {'Workflow': row.manifest_id});
						}
						console.log("res from app", res);
					})
				}
			});
		}).catch(function(err){

		});
		
	},
	onEditWorkflow: function(workflow){
		modalActions.loadModal('alert', {buttons: ["Cancel", "Rename", "Remove"], title: 'Workflow', message: 'What do you want to do with this workflow?'}, function(res){
			if(res && res.button === 3){
				swipes.api.request("users.removeWorkflow", {"workflow_id": workflow.id}, function(res,error){
					if(res && res.ok){
						amplitude.logEvent('Engagement - Removed Workflow', {'Workflow': workflow.manifest_id});
					}
					console.log("res from app", res);
				})
			}
			else if(res && res.button === 2){
				var newName = prompt('Rename workflow', workflow.name);
				if(newName){
					swipes.api.request('users.renameWorkflow', {'workflow_id': workflow.id, name: newName}, function(res, error){

					})
				}
			}
		});
		
	}
});

module.exports = SidebarStore;