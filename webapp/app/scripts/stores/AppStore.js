var Reflux = require('reflux');

var data = [];

var AppStore = Reflux.createStore({
	localStorage: "app_store",
	sort: "name"
});

module.exports = AppStore;
