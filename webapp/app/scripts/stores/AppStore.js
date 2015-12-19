var Reflux = require('reflux');

var AppStore = Reflux.createStore({
	localStorage: "AppStore",
	sort: "name",
	search:function(string, options){
		return [];
	}
});

module.exports = AppStore;
