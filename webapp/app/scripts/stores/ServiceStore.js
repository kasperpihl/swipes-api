var Reflux = require('reflux');
var serviceActions = require('../actions/ServiceActions');
var ServiceStore = Reflux.createStore({
	listenables: [ serviceActions ],
	onAuthorize: function(serviceName){
		swipes.service(serviceName).authorize(function(res, err){
			console.log('auth cb service store', res, err);
		});
	}
});

module.exports = ServiceStore;
