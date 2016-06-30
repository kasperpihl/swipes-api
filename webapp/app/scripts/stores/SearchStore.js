var Reflux = require('reflux');

var SearchStore = Reflux.createStore({
	init: function(){
		this.manualLoadData();
	},
	onSearch: function(string, options){
		
	}
});

module.exports = SearchStore;
