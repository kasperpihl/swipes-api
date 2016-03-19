var Reflux = require('reflux');

var UserStore = Reflux.createStore({
	idAttribute: 'key'
});

module.exports = UserStore;
