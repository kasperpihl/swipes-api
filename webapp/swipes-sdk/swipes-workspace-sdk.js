var SwipesAppSDK = (function() {
	var self;
	function SwipesAppSDK(apiUrl) {
		if (!SwipesAPIConnector){
			throw new Error("SwipesAppSDK: SwipesAPIController not loaded first")
		}

		var apiUrl = window.location.origin;

		this._client = new SwipesAPIConnector(apiUrl);

		self = this;
	}

	SwipesAppSDK.prototype.setToken = function(token){
		this._client.setToken(token);
	};
	SwipesAppSDK.prototype.getToken = function(){
		return this._client._token;
	};

	SwipesAppSDK.prototype.api = {
		request: function(options, data, callback){
			return self._client.callSwipesApi(options, data, callback);
		}
	};

	SwipesAppSDK.prototype.service = function(serviceName){
		return {
			getAuthorizeURL: function(callback){
				return self._client.getAPIURL() + 'services.authorize?service=' + serviceName;
			},
			authSuccess: function(data, callback){
				var options = {
					service: serviceName,
					data: data
				};
				self._client.callSwipesApi("services.authsuccess", options, callback);
			},
			request:function(method, parameters, callback){
				var deferred = Q.defer();

				if(!method || typeof method !== 'string' || !method.length)
					throw new Error("SwipesAppSDK: service:request method required");
				if(typeof parameters === 'function')
					callback = parameters;
				parameters = (typeof parameters === 'object') ? parameters : {};
				var options = {
					service: serviceName,
					data: {
						method: method,
						parameters: parameters
					}
				};

				if(self.info.selectedAccountId){
					options.account_id = self.info.selectedAccountId;
				}

				var intCallback = function(res, error){
					if(callback) callback(res,error);
					if(res) deferred.resolve(res);
					else deferred.reject(error);
				};

				self.api.request("services.request", options, intCallback);
				return deferred.promise;
			},
			stream:function(method, parameters, callback){
				var deferred = Q.defer();

				if(!method || typeof method !== 'string' || !method.length)
					throw new Error("SwipesAppSDK: service:stream method required");
				if(typeof parameters === 'function')
					callback = parameters;
				parameters = (typeof parameters === 'object') ? parameters : {};
				var options = {
					service: serviceName,
					data: {
						method: method,
						parameters: parameters
					}
				};

				var intCallback = function(res, error){
					if(callback) callback(res,error);
					if(res) deferred.resolve(res);
					else deferred.reject(error);
				};

				self._client.callSwipesStreamApi("services.stream", options, intCallback);
				return deferred.promise;
			}
		};
	};

	SwipesAppSDK.prototype.share = {
		init: function (data) {
			self._client.callListener('share.init', data);
		},
		transmit: function(data){
			self._client.callListener('share.transmit', data);
		}
	};


	return SwipesAppSDK;
})();
