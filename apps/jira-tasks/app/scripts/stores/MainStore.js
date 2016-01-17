var Reflux = require('reflux');
var UserStore = require('./UserStore');
var IssueStore = require('./IssueStore');
var MainStore = Reflux.createStore({
	start: function(){
		IssueStore.fetch();
		UserStore.fetch();
	}
});

module.exports = MainStore;