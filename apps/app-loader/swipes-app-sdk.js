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
		console.log(this.info);
	}

	SwipesAppSDK.prototype.setToken = function(token){
		this._client.setToken(token);
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
		console.log(self.info, this.info);
		if(!self.info.app_id)
			throw new Error('SwipesAppSDK: App Id has not been set');
		return self.app(self.info.app_id);
	};
	SwipesAppSDK.prototype.setDefaultScope = function(scope){
		self._defaultScope = scope;
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

				var intCallback = function(res, error){
					if(callback) callback(res,error);
					if(res) deferred.resolve(res);
					else deferred.reject(error);
				};
				
				if(appId == "core"){
					self._client.callListener("getData", data, intCallback);
				}
				else
					self._client.callSwipesApi("apps.getData", data, intCallback);
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
					app_id: appId,
					method:methodName
				};
				if(typeof methodData === 'object'){
					data.data = methodData;
				}
				else if(typeof methodData === 'function'){
					callback = methodData;
				}

				var intCallback = function(res, error){
					if(callback) callback(res,error);
					if(res) deferred.resolve(res);
					else deferred.reject(error);
				};
				self._client.callSwipesApi("apps.method", data, intCallback);
				return deferred.promise;
			},
			on:function(event, handler){
				eventName = event
				if(appId && appId !== "core")
					eventName = appId + "_" + event
				self._listeners.add(eventName, handler);
				self._client.callListener("listenTo", {event: eventName});
			}
		}
	};

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
	SwipesAppSDK.prototype.connectorHandleResponseReceivedFromListener = function(connector, message, callback){
		if(message){
			var data = message.data;
			if(message.command == "init"){
				if(data.user_id)
					this.info.userId = data.user_id;
				if(data.default_scope)
					this.setDefaultScope(data.default_scope);
			}
			else if(message.command == "event"){
				var listeners = self._listeners.get(data.type);
				for(var i = 0 ; i < listeners.length ; i++){

					var handler = listeners[i];

					if(handler)
						handler(message);
				}
			}
		}
		if(callback)
			callback("yeah");
	};
	SwipesAppSDK.prototype.update = {

	};
	return SwipesAppSDK;

})();
