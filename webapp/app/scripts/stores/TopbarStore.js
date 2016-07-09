var Reflux = require('reflux');
var topbarActions = require('../actions/TopbarActions');
var notificationActions = require('../actions/NotificationActions');
var modalActions = require('../actions/ModalActions');
var searchActions = require('../actions/SearchActions');

var WorkflowStore = require('./WorkflowStore');
var TopbarStore = Reflux.createStore({
	listenables: [ topbarActions ],
	onLoadWorkflowModal:function(){
		swipesApi.request('workflows.list').then(function(res){
			modalActions.loadModal("list", {"title": "Add a workflow", "emptyText": "We're working on adding more workflows.", "rows": res.data }, function(row){
				if(row){
					swipesApi.request("users.addWorkflow", {"manifest_id": row.manifest_id}, function(res,error){
						if(res && res.ok){
							amplitude.logEvent('Engagement - Added Workflow', {'Workflow': row.manifest_id});
							mixpanel.track('Added Card', {'Card': row.manifest_id});
						}
						console.log("res from app", res);
					})
				}
			});
		}).catch(function(err){

		});

	},
	onClearFocusVar:function(){
		this.set('focusOnSearch', false, {trigger: false});	
	}
});

module.exports = TopbarStore;
