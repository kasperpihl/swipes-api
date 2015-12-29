var SwipesAppSDK = (function() {
	var self;
	function SwipesAppSDK(apiUrl) {
		if (!SwipesAPIConnector){
			throw new Error("SwipesAppSDK: SwipesAPIController not loaded first")
		}
		if (!apiUrl){
			throw new Error("SwipesAppSDK: No apiUrl set in constructor");
		}

		this._client = new SwipesAPIConnector(apiUrl);
		// set the sdk property on client so it can call this class
		this._client.setDelegate(this);
		this._listenersObj = {};
		self = this;
	}

	SwipesAppSDK.prototype.setAppId = function(appId){
		this.info.app_id = appId;
		this._client.setAppId(appId);
	}

	SwipesAppSDK.prototype.setToken = function(token){
		this._client.setToken(token);
	};
	SwipesAppSDK.prototype.getToken = function(){
		return this._client._token;
	};


	// API for handling navigation bar in main app
	SwipesAppSDK.prototype.navigation = {
		// Setting the title of the navigation bar manually
		setTitle:function(title){
			self._client.callListener("navigation.setTitle",{"title":title});
		},
		// Push new title (view), will show a backbutton.
		push: function(title, identifier){
			self._client.callListener("navigation.push", {title: title, identifier: identifier})
		},
		// Pops back one title
		pop: function(){
			self._client.callListener("navigation.pop")
		},
		setButtons: function(buttons){
			// TODO: prefix any images with url.
			self._client.callListener("navigation.setButtons", buttons);
		},
		setBackgroundColor:function(backgroundColor){
			self._client.callListener("navigation.setBackgroundColor", {"color": backgroundColor});
		},
		setForegroundColor: function(foreground){
			self._client.callListener("navigation.setForegroundColor", {"color": foreground});
		},
		enableBoxShadow: function(enable){
			self._client.callListener("navigation.enableBoxShadow", {"enable": enable})
		},
		onPop: function(callback){
			self._listeners.add("navigation.pop", callback);
		},
		onButtonPressed:function(callback){
			self._listeners.add("navigation.onButtonPressed", callback);
		}
	};

	SwipesAppSDK.prototype.info = {
		// Manifest will be loaded in here
	};
	SwipesAppSDK.prototype.mainApp = function(){
		return self.app();
	};
	SwipesAppSDK.prototype.currentApp = function(){
		if(!self.info.app_id)
			throw new Error('SwipesAppSDK: App Id has not been set');
		return self.app(self.info.app_id);
	};
	SwipesAppSDK.prototype.setDefaultScope = function(scope){
		self._defaultScope = scope;
	};
	SwipesAppSDK.prototype.onReady = function(callback){
		self._listeners.add("init", callback);
	};

	// API for handling data from apps
	SwipesAppSDK.prototype.app = function(appId){
		if(!appId)
			appId = "core";
		return {
			get:function(options, id, callback){
				var deferred = Q.defer();
				var data = {
					app_id: appId,
					query: {}
				};
				if(typeof options === 'string')
					data.query.table = options;
				else if(typeof options === 'object' && typeof options.table === 'string'){
					data.query = options;
				}
				else{
					throw new Error("SwipesAppSDK: Get request must have table")
				}
				if(typeof id === 'string'){
					data.query.id = id;
				}
				else if(typeof id === 'function')
					callback = id;

				if (appId !== 'core') {
					var filter = data.query.query.filter || {};
					// If defaultscope is set
					if(self._defaultScope){
						filter.scope = self._defaultScope;
					}
					if(typeof options.scope === 'string'){
						filter.scope = options.scope;
					}

					data.query.query.filter = filter;
				}

				var intCallback = function(res, error){
					if(callback) callback(res,error);
					if(res) deferred.resolve(res);
					else deferred.reject(error);
				};

				if(appId == "core"){
					self._client.callListener("getData", data, intCallback);
				} else {
					self._client.callSwipesApi("apps.getData", data, intCallback);
				}

				return deferred.promise;
			},
			save: function(options, saveData, callback){
				var deferred = Q.defer();
				var data = {
					app_id: appId,
					query: { data: saveData }
				};

				if(typeof options === 'string'){
					options = {table: options};
				}

				if(typeof options !== 'object'){
					throw new Error("SwipesAppSDK: save: options must be included");
				}
				if(typeof saveData !== 'object'){
					throw new Error("SwipesAppSDK: save: data object is required");
				}

				if(typeof options.table !== 'string'){
					throw new Error("SwipesAppSDK: save: request must have table");
				}
				data.query.table = options.table;

				// If defaultscope is set
				if(self._defaultScope){
					data.query.scope = self._defaultScope;
				}
				if(typeof options.scope === 'string'){
					data.query.scope = options.scope;
				}

				var intCallback = function(res, error){
					if(callback) callback(res,error);
					if(res) deferred.resolve(res);
					else deferred.reject(error);
				};
				self._client.callSwipesApi("apps.saveData", data, intCallback);
				return deferred.promise;
			},
			method: function(methodName, methodData, callback){
				var deferred = Q.defer();
				var data = {
					manifest_id: appId,
					method: methodName
				};
				if(typeof methodData === 'object'){
					data.data = methodData;
				}
				else if(typeof methodData === 'function'){
					callback = methodData;
				}

				var intCallback = function(error, res){
					if(callback) {
						callback(res, error);
					}

					if(res) {
						deferred.resolve(res);
					} else {
						deferred.reject(error);
					}
				};

				self._client.callSwipesApi("apps.method", data, intCallback);

				return deferred.promise;
			},
			on:function(event, handler){
				eventName = event
				if(appId && appId !== "core")
					eventName = appId + "_" + event;
				self._listeners.add(eventName, handler);
				self._client.callListener("listenTo", {event: eventName});
			}
		}
	};
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
		search: function(options, callback){
			this.load("search", options, callback);
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
			self._client.callListener("modal.load", {modal: name, options: options}, callback);
		}
	}

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

	// API for handling calls from main app
	SwipesAppSDK.prototype.connectorHandleResponseReceivedFromListener = function (connector, message, callback) {
		if(message){
			var data = message.data;

			if(message.command == "event"){
				if(message.data.type == "init"){
					if(data.data.preview_obj)
						this.info.previewObj = data.data.preview_obj;
					if(data.data.channel_id)
						this.info.channelId = data.data.channel_id;
					if(data.data.manifest.manifest_id)
						this.setAppId(data.data.manifest.manifest_id);
					if(data.data.user_id)
						this.info.userId = data.data.user_id;

					if(data.data.default_scope)
						this.setDefaultScope(data.data.default_scope);
					else
						this.setDefaultScope(data.data.manifest.id);
				}

				var listeners = self._listeners.get(data.type);

				for (var i = 0 ; i < listeners.length ; i++) {

					var handler = listeners[i];

					if(handler) {
						handler(message);
					}
				}
			}
		}

		if(callback) {
			callback("yeah");
		}
	};

	SwipesAppSDK.prototype.update = {

	};

	return SwipesAppSDK;
})();
