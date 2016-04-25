var SwipesAppSDK = (function() {
	var self;
	function SwipesAppSDK(apiUrl) {
		if (!SwipesAPIConnector){
			throw new Error("SwipesAppSDK: SwipesAPIController not loaded first")
		}

		var apiUrl = window.location.origin;

		this._client = new SwipesAPIConnector(apiUrl);
		// set the sdk property on client so it can call this class
		this._client.setDelegate(this);
		this._listenersObj = {};
		window.addEventListener('focus', function(){ this._client.callListener('event.focus'); }.bind(this));
		self = this;
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
		setBadge: function(badge){
			self._client.callListener('navigation.setBadge', {badge: badge});
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

	SwipesAppSDK.prototype.setDefaultScope = function(scope){
		self._defaultScope = scope;
	};
	SwipesAppSDK.prototype.onReady = function(callback){
		self._listeners.add("init", callback);
	};
	SwipesAppSDK.prototype.onAppFocus = function(callback){
		self._listeners.add('app.focus', callback);
	};
	SwipesAppSDK.prototype.onAppBlur = function(callback){
		self._listeners.add('app.blur', callback);
	};
	SwipesAppSDK.prototype.onMenuButton = function(callback){
		self._listeners.add('menu.button', callback);
	};
	SwipesAppSDK.prototype.onPreview = function(callback){
		self._listeners.add("preview", callback);
	};
	SwipesAppSDK.prototype.onShareRequest = function(callback){
		self._listeners.add("share.request", callback);
	};
	SwipesAppSDK.prototype.onShareInit = function(callback){
		self._listeners.add("share.init", callback);
	};
	SwipesAppSDK.prototype.onShareTransmit = function(callback){
		self._listeners.add("share.transmit", callback);
	};

	SwipesAppSDK.prototype.api = {
		request: function(options, data, callback){
			return self._client.callSwipesApi(options, data, callback);
		}
	};
	// API for handling data from apps
	SwipesAppSDK.prototype.workflow = function(workflowId){
		return {
			get:function(options, id, callback){
				var deferred = Q.defer();
				var data = {
					workflow_id: workflowId,
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

				var filter = data.query.query.filter || {};
				// If defaultscope is set
				if(self._defaultScope){
					filter.scope = self._defaultScope;
				}
				if(typeof options.scope === 'string'){
					filter.scope = options.scope;
				}

				data.query.query.filter = filter;

				var intCallback = function(res, error){
					if(callback) callback(res,error);
					if(res) deferred.resolve(res);
					else deferred.reject(error);
				};

				self._client.callSwipesApi("workflows.getData", data, intCallback);

				return deferred.promise;
			},
			save: function(options, saveData, callback){
				var deferred = Q.defer();
				var data = {
					workflow_id: workflowId,
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
				self._client.callSwipesApi("workflows.saveData", data, intCallback);
				return deferred.promise;
			},
			method: function(methodName, methodData, callback){
				var deferred = Q.defer();
				var data = {
					workflow_id: workflowId,
					method: methodName
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

				self._client.callSwipesApi("workflows.method", data, intCallback);

				return deferred.promise;
			},
			on:function(event, handler){
				eventName = event
				if(workflowId)
					eventName = workflowId + "_" + event;
				self._listeners.add(eventName, handler);
				self._client.callListener("listenTo", {event: eventName});
			}
		}
	};
	SwipesAppSDK.prototype.addEventListener = function(eventName, callback){
		self._listeners.add(eventName, callback);
	}

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
		leftNav: function(options, callback){
			self._client.callListener('leftNav.load', options, callback);
		},
		edit: function(title, message, callback){
			var options = {};
			options = this._getOptions(options, title, message);
			this.load("textarea", options, function(res){
				if(typeof callback === 'function')
					callback(res);
			})
		},
		schedule: function(callback) {
			this.load("schedule", function(res) {
				if(typeof callback === 'function') {
					callback(res)
				}
			})
		},
		lightbox: function(url, title, callback) {
			var options = {};
			options = this._getOptions(options, url, title);
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
			self._client.callListener("modal.load", {modal: name, options: options}, callback);
		}
	}
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

				var intCallback = function(res, error){
					if(callback) callback(res,error);
					if(res) deferred.resolve(res);
					else deferred.reject(error);
				};

				self._client.callSwipesApi("services.request", options, intCallback);
				return deferred.promise;
			}
		};
	};
	SwipesAppSDK.prototype.analytics = {
		action:function(name){
			self._client.callListener("analytics.action", {name: name});
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

	SwipesAppSDK.prototype.share = {
		request: function (data) {
			self._client.callListener("share.request", data);
		},
		init: function (data) {
			self._client.callListener('share.init', data);
		},
		transmit: function(data){
			self._client.callListener('share.transmit', data);
		}
	};

	SwipesAppSDK.prototype.actions = {
		openURL: function(url){
			self._client.callListener("actions.openURL", {url: url});
		}
	};
	SwipesAppSDK.prototype.notifications = {
		send: function(options){
			self._client.callListener("notifications.send", options);
		}
	};
	SwipesAppSDK.prototype.dot = {
		startDrag: function(data, callback){
			self._client.callListener('actions.startDrag', data, callback);
		}
	}

	// API for handling calls from main app
	SwipesAppSDK.prototype.connectorHandleResponseReceivedFromListener = function (connector, message, callback) {
		var res;
		if(message){
			var data = message.data;

			if(message.command == "event"){
				if(message.data.type == "init"){
					if(data.data.manifest){
						this.info.workflow = data.data.manifest;
						this._client.setId(data.data.manifest.id);
					}
					if(data.data.user_id){
						this.info.userId = data.data.user_id;
						this.setDefaultScope(data.data.user_id);
					}
				}

				var listeners = self._listeners.get(data.type);

				for (var i = 0 ; i < listeners.length ; i++) {

					var handler = listeners[i];

					if(handler) {
						res = handler(message);
					}
				}
			}
		}

		if(callback) {
			callback(res);
		}
	};

	return SwipesAppSDK;
})();
