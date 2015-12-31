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
			user.info = user.info || {};

			var searchResult = {
				appId: "AUSER",
				text: user.name,
				id: user.id,
				// T_TODO
				// Kristian, Kasper
				// The default values are fake because we dont really want to update
				// the database before we stop at something
				// we have to deside what we are going to do with the profile images?
			 // should we build profile settings page before the private beta?
				fullname: user.info.fullname || "Fake Fullname",
				position: user.info.position || "CEO",
				image: "https://unsplash.it/40/?random"
			};
			if(user.name.toLowerCase().startsWith(string.toLowerCase())){
				results.push(searchResult);
			}
		})
		return {
			appId: "AUSER",
			name: "People",
			results: results
		};
	}
});

module.exports = UserStore;
