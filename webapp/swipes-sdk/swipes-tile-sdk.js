var SwipesAppSDK = (function() {
	var self;
	function SwipesAppSDK(apiUrl) {
		if (!SwipesAPIConnector){
			throw new Error("SwipesAppSDK: SwipesAPIController not loaded first")
		}

		var apiUrl = window.location.origin;
		this._com = new SwClientCom(this, parent);
		this._com.lock(); // Lock until init from the workspace, this will queue all calls and fire them once ready (init calls unlock);

		this.api = new SwipesAPIConnector(apiUrl);
		this._tempListenerQueue = [];
		this._listenersObj = {};

		self = this;
	}

	// Send events to the workspace
	SwipesAppSDK.prototype.sendEvent = function(command, data, callback){
		this._com.sendMessage(command, data, callback);
	}
	// Add listener to events sent from workspace
	SwipesAppSDK.prototype.addListener = function(eventName, callback){
		self._listeners.add(eventName, callback);
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
		leftNav: function(options, callback){
			self.sendEvent('leftNav.load', options, callback);
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
		feedback: function(title, placeholder, callback) {
			title = title || '';
			placeholder = placeholder || '';

			var options = {
				title: title,
				placeholder: placeholder
			};

			this.load('textarea', options, function(res) {
				if(typeof callback === 'function') {
					callback(res);
					console.log('yoyoyoyoyooy');
				}
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
	
	// Internal listener api, used for handling received events
	SwipesAppSDK.prototype._listeners = {
		add: function(eventName, callback){
			var currentListeners = self._listenersObj[eventName];
			if(!currentListeners)
				currentListeners = [];
			currentListeners.push(callback);
			self._listenersObj[eventName] = currentListeners;
		},
		remove: function(eventName){

		},
		get: function(eventName){
			var currentListeners = self._listenersObj[eventName];

			if(!currentListeners)
				currentListeners = [];
			return currentListeners;
		}
	}

	
	// Delegate method for communicator whenever receiving a message from the workspace
	SwipesAppSDK.prototype.handleReceivedMessage = function (message, callback) {
		var res = null;

		if (message && message.command) {
			var data = message.data;
			if(message.command == "init"){
				if(data.token) {
					this.api.setToken(data.token);
				}
				if(data.info){
					this.info = data.info;
				}
				// Now let's unlock the communicator since the connection from the workspace is ready
				if(this._com.isLocked()){
					this._com.unlock();
				}
			}

			// When receiving a command, check if any listeners have been attached and call them.
			var listeners = self._listeners.get(message.command);
			for (var i = 0 ; i < listeners.length ; i++) {
				var handler = listeners[i];
				if(handler) {
					// Limitation, only the last callback added will return a result to callback
					res = handler(message);
				}
			}
		}

		if(callback) {
			// Always callback any result from the listener, if any.
			callback(res);
		}
	};

	return SwipesAppSDK;
})();
