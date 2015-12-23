var Reflux = require('reflux');

var data = [];

var UserStore = Reflux.createStore({
	localStorage: "UserStore",
	sort: "name",
	me: function(){
		return this.find({me: true});
	},
	search:function(string, options){
		var results = [];
		this.each(function(user){
			var searchResult = {
				appId: "AUSER",
				text: user.name,
				id: user.id
			};
			if(user.name.toLowerCase().startsWith(string.toLowerCase())){
				results.push(searchResult);
			}
		})
		return {
			appId: "AUSER",
			name: "Users",
			results: results
		};
	}
});

module.exports = UserStore;
