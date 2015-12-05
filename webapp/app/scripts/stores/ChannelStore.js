var Reflux = require('reflux');
var data = [];

var ChannelStore = Reflux.createStore({
	localStorage: "ChannelStore",
	idAttribute: "id",
	sort: 'name'
});

module.exports = ChannelStore;
