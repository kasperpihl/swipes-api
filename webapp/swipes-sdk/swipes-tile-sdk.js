var SwipesAppSDK = (function() {
	var self;
	function SwipesAppSDK(apiUrl) {
		if (!SwipesAPIConnector){
			throw new Error("SwipesAppSDK: SwipesAPIController not loaded first")
		}

		var apiUrl = window.location.origin;
		this._com = new SwClientCom(this);
		this._com.setTarget(parent);
		this._com.lock(); // Lock until ready from the workspace
		
		this._api = new SwipesAPIConnector(apiUrl);
		this._tempListenerQueue = [];
		this._listenersObj = {};

		self = this;
	}
	
	SwipesAppSDK.prototype.setToken = function(token){
		this._api.setToken(token);
	};
	SwipesAppSDK.prototype.getToken = function(){
		return this._api._token;
	};

	// API for handling navigation bar in main app
	SwipesAppSDK.prototype.navigation = {
		// Setting the title of the navigation bar manually
		setTitle:function(title){
			self.sendMessageToWorkspace("navigation.setTitle",{"title":title});
		},
		setBadge: function(badge){
			self.sendMessageToWorkspace('navigation.setBadge', {badge: badge});
		}
	};

	SwipesAppSDK.prototype.info = {
		// Manifest will be loaded in here
	};

	SwipesAppSDK.prototype.onReady = function(callback){
		self.addEventListener("init", callback);
	};
	SwipesAppSDK.prototype.onAppFocus = function(callback){
		self.addEventListener('app.focus', callback);
	};
	SwipesAppSDK.prototype.onAppBlur = function(callback){
		self.addEventListener('app.blur', callback);
	};
	SwipesAppSDK.prototype.onMenuButton = function(callback){
		self.addEventListener('menu.button', callback);
	};
	SwipesAppSDK.prototype.onShareInit = function(callback){
		self.addEventListener("share.init", callback);
	};
	SwipesAppSDK.prototype.onShareTransmit = function(callback){
		self.addEventListener("share.transmit", callback);
	};
	SwipesAppSDK.prototype.onRequestPreOpenUrl = function(callback){
		self.addEventListener("request.preOpenUrl", callback);
	};
	SwipesAppSDK.prototype.onRequestOpenUrl = function(callback){
		self.addEventListener("request.openUrl", callback);
	};

	SwipesAppSDK.prototype.api = {
		request: function(options, data, callback){
			return self._api.request(options, data, callback);
		},
		streamRequest: function(options, data, callback){
			return self._api.streamRequest(options, data, callback);
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
		leftNav: function(options, callback){
			self.sendMessageToWorkspace('leftNav.load', options, callback);
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
			self.sendMessageToWorkspace("modal.load", {modal: name, options: options}, callback);
		}
	}
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

				self._api.request("services.request", options, intCallback);
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

				self._api.streamRequest("services.stream", options, intCallback);
				return deferred.promise;
			}
		};
	};
	SwipesAppSDK.prototype.analytics = {
		action:function(name){
			self.sendMessageToWorkspace("analytics.action", {name: name});
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

	SwipesAppSDK.prototype.share = function (data, callback) {
		self.sendMessageToWorkspace("share.request", data, callback);
	};

	SwipesAppSDK.prototype.request = {
		preOpenUrl: function (data) {
			self.sendMessageToWorkspace('request.preOpenUrl', data);
		},
		openUrl: function(data){
			self.sendMessageToWorkspace('request.openUrl', data);
		}
	};

	SwipesAppSDK.prototype.actions = {
		openURL: function(url){
			self.sendMessageToWorkspace("actions.openURL", {url: url});
		}
	};
	SwipesAppSDK.prototype.notifications = {
		send: function(options){
			self.sendMessageToWorkspace("notifications.send", options);
		}
	};
	SwipesAppSDK.prototype.dot = {
		startDrag: function(data, callback){
			self.sendMessageToWorkspace('actions.startDrag', data, callback);
		}
	}

	// API for handling calls from main app
	SwipesAppSDK.prototype.sendMessageToWorkspace = function(command, data, callback){
		this._com.sendMessage(command, data, callback);
	}
	// Delegate method for communicator whenever receiving a message from the workspace
	SwipesAppSDK.prototype.handleReceivedMessage = function (message, callback) {
		var res = null;

		if (message && message.command) {
			var data = message.data;
			if(message.command == "init"){
				if(data.token) {
					this._api.setToken(data.token);
				}
				if(data.manifest){
					this.info.workflow = data.manifest;
				}
				if(data.selectedAccountId){
					this.info.selectedAccountId = data.selectedAccountId;
				}
				if(data.user_id){
					this.info.userId = data.user_id;
				}
				if(this._com.isLocked()){
					this._com.unlock();
				}
			}

			var listeners = self._listeners.get(message.command);

			for (var i = 0 ; i < listeners.length ; i++) {
				var handler = listeners[i];
				if(handler) {
					res = handler(message);
				}
			}
		}

		if(callback) {
			callback(res);
		}
	};

	return SwipesAppSDK;
})();
