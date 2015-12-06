var Reflux = require('reflux');

var data = [];

var AppStore = Reflux.createStore({
	localStorage: "AppStore",
	sort: "name"
});

module.exports = AppStore;
