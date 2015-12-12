var Reflux = require('reflux');

var data = [];

var UserStore = Reflux.createStore({
	localStorage: "UserStore",
	sort: "name",
	me: function(){
		return this.find({me: true});
	}
});

module.exports = UserStore;
