var Reflux = require('reflux');
var serviceActions = require('../actions/ServiceActions');
var ServiceStore = Reflux.createStore({
	listenables: [ serviceActions ],
	onAuthorize: function(serviceName){
		var self = this;

		swipes.service(serviceName).authorize(function(res, err){
			if(res && res.ok){
				var auth = res.result;
				if(auth.type === 'oauth'){
					window.OAuthHandler = serviceActions;
					var win = window.open(auth.url, serviceName, "height=700,width=500");
					if(!win || win.closed || typeof win.closed=='undefined'){
						return alert('Please allow popups to authorize services');
					}
					var timer = setInterval(function() {
						if(win.closed) {
							clearInterval(timer);
							// K_TODO:
						}
					}, 1000);
				}
			}
		});
	},
	onHandleOAuthSuccess: function(serviceName, query){
		if(typeof query === "string"){
			query = JSON.parse(query);
		}
		swipes.service(serviceName).authSuccess(query, function(res, err){
			amplitude.logEvent('Engagement - Added Service', {'Service': serviceName});
			mixpanel.track('Engagement - Added Service', {'Service': serviceName});
			console.log('oauth success!', res, err);
		})
	}
});

module.exports = ServiceStore;
