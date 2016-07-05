var SwipesAppSDK = (function() {
	var self;
	function SwipesAppSDK(apiUrl) {
		if (!SwipesAPIConnector){
			throw new Error("SwipesAppSDK: SwipesAPIController not loaded first")
		}

		var apiUrl = window.location.origin;
		this.api = new SwipesAPIConnector(apiUrl);

		// workspaceSendFunction is defined in the preload
		this.com = new SwClientCom(workspaceSendFunction);
		this.com.lock(); // Lock until init from the workspace, this will queue all calls and fire them once ready (init calls unlock);
		this.com.addListener('init', function(data){
			if(data.token) {
				this.api.setToken(data.token);
			}
			if(data.info){
				this.info = data.info;
			}
			// Now let's unlock the communicator since the connection from the workspace is ready
			if(this.com.isLocked()){
				this.com.unlock();
			}
		}.bind(this));

		
		self = this;

	}

	// Send events to the workspace
	SwipesAppSDK.prototype.sendEvent = function(command, data, callback){
		this.com.sendCommand(command, data, callback);
	}
	// Add listener to events sent from workspace
	SwipesAppSDK.prototype.addListener = function(command, listener, ctx){
		self.com.addListener(command, listener, ctx);
	}
	// Remove listener from events sent from workspace
	SwipesAppSDK.prototype.removeListener = function(command, listener, ctx){
		self.com.removeListener(command, listener, ctx);
	}

	// initObj.info from tile_loader will be this after init.
	SwipesAppSDK.prototype.info = {};

	// Shorthand for getting the init event
	SwipesAppSDK.prototype.ready = function(callback){
		self.addListener("init", callback);
	};

	

	// Shorthands for creating modals in the workspace
	SwipesAppSDK.prototype.modal = {
		_getOptions: function(options, title, message){
			if(typeof title === 'object'){
				options = title;
			}
			if(typeof title === 'string'){
				options.title = title;
			}
			if(typeof message === 'string'){
				options.message = message;
			}
			return options;
		},
		edit: function(title, message, callback){
			var options = {};
			options = this._getOptions(options, title, message);
			this.load("textarea", options, function(res){
				if(typeof callback === 'function')
					callback(res);
					console.log(res);
			})
		},
		schedule: function(callback) {
			this.load("schedule", function(res) {
				if(typeof callback === 'function') {
					callback(res)
				}
			})
		},
		lightbox: function(src, title, url) {
			title = title || '';
			url = url || '';

			var options = {
				src: src,
				title: title,
				url: url
			};

			this.load("lightbox", options)
		},
		alert: function(title, message, callback){
			var options = {buttons: ["Okay"]};
			options = this._getOptions(options, title, message);

			if(typeof title === 'function'){
				callback = title;
			}
			if(typeof message === 'function'){
				callback = message;
			}

			this.load("alert", options, function(res){
				if(typeof callback === 'function')
					callback(res);
			})
		},
		confirm: function(title, message, callback){
			var options = {buttons: ["No", "Yes"]};
			options = this._getOptions(options, title, message);

			if(typeof title === 'function'){
				callback = title;
			}
			if(typeof message === 'function'){
				callback = message;
			}

			this.load("alert", options, function(res){
				var confirmed = (res && res.button === 2);
				if(typeof callback === 'function')
					callback(confirmed);
			})
		},
		load: function(name, options, callback){
			options = options || {};
			if(typeof options === 'function'){
				callback = options;
				options = {};
			}
			self.sendEvent("modal.load", {modal: name, options: options}, callback);
		}
	}
	// Shorthands for contacting service api
	SwipesAppSDK.prototype.service = function(serviceName){
		return {
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

				self.api.streamRequest("services.stream", options, intCallback);
				return deferred.promise;
			}
		};
	};

	return SwipesAppSDK;
})();
