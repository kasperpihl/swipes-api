var Reflux = require('reflux');
var homeActions = require('../actions/HomeActions');

console.log("act",homeActions);
var HomeStore = Reflux.createStore({
	listenables: [homeActions],
	localStorage: "home_store",
	onToggleSidebar: function(){
		this.set("sidebar-closed", !this.get("sidebar-closed"));
	},
	checkForAndSetToken: function(){
		var swipesToken = this.get("swipesToken");
		if(!swipesToken){
			swipesToken = localStorage.getItem("swipes-token");
			this.set("swipesToken", swipesToken);
		}
		if(swipesToken){
			swipes.setToken(swipesToken);
		}
	},
	getInitialState: function(){
		var data = this.manualLoadData();
		this.checkForAndSetToken();		
		return data;
	},
	init: function() {
		// This funciton will be called when the store will be first initialized
	}

});

module.exports = HomeStore;
