var Reflux = require('reflux');
var sidebarActions = require('../actions/SidebarActions');
var modalActions = require('../actions/ModalActions');
var appStore = require('./AppStore');
var SidebarStore = Reflux.createStore({
	listenables: [ sidebarActions ],
	onLoadAppModal:function(){
		var filteredApps = _.filter(appStore.getAll(), function(app){ 
			if(!app.is_active)
				return true;
			return false; 
		});
		console.log('filter', filteredApps);
		modalActions.loadModal("list", {"title": "Add a workflow", "emptyText": "We're working on adding more workflows.", "rows": filteredApps }, function(row){
			if(row){
				swipes._client.callSwipesApi("users.activateApp", {"app_id": row.id}, function(res,error){
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