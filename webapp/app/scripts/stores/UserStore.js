var Reflux = require('reflux');

var data = [];

var UserStore = Reflux.createStore({
	localStorage: "UserStore",
	sort: "name",
	me: function(){
		return this.find({me: true});
	},
	search:function(string, options){
		return [];
	}
});

module.exports = UserStore;
