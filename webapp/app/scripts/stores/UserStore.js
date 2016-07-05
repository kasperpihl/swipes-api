var Reflux = require('reflux');
var userActions = require('../actions/UserActions');

var data = [];

var UserStore = Reflux.createStore({
	listenables: [ userActions ],
	localStorage: "UserStore",
	sort: "name",
	me: function(){
		return _.findWhere(this.getAll(), {me: true});
	},
	onServiceDisconnect: function (serviceId) {
		swipesApi.request('users.serviceDisconnect', {id: serviceId}, function () {
			// K_TODO update UserStore
			console.log('Service disconnected');
		});
	}
});

module.exports = UserStore;
