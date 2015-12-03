var Reflux = require('reflux');

var data = [];

var UserStore = Reflux.createStore({
	localStorage: "UserStore"
});

module.exports = UserStore;
