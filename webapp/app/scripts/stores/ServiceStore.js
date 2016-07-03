var Reflux = require('reflux');
var serviceActions = require('../actions/ServiceActions');
var ServiceStore = Reflux.createStore({
	listenables: [ serviceActions ],
	onHandleOAuthSuccess: function(serviceName, query){
		if(typeof query === "string"){
			query = JSON.parse(query);
		}
		var options = {
			service: serviceName,
			data: query
		};
		swipesApi.request('services.authsuccess', options, function(res, err){
			amplitude.logEvent('Engagement - Added Service', {'Service': serviceName});
			mixpanel.track('Added Service', {'Service': serviceName});
			console.log('oauth success!', res, err);
		});
	}
});

module.exports = ServiceStore;
