var Reflux = require('reflux');
var sidebarActions = require('../actions/SidebarActions');
var modalActions = require('../actions/ModalActions');
var appStore = require('./AppStore');
var SidebarStore = Reflux.createStore({
	listenables: [ sidebarActions ],
	onLoadAppModal:function(){
		console.log('loading app modal');
		var filteredApps = appStore.filter(function(app){ 
			console.log(app);
			if(!app.is_active)
				return true;
			return false; 
		});
		modalActions.loadModal("list", {"title": "Activate an app", "emptyText": "No apps to activate", "rows": filteredApps }, function(row){
			console.log("callback row", row);
			if(row){
				swipes._client.callSwipesApi("users.activateApp", {"app_id": row.id}, function(res,error){
					console.log("res from app", res);
				})
			}
		});
	}
});

module.exports = SidebarStore;
