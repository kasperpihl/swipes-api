var SwipesAPIConnector = (function () {
	function SwipesAPIConnector(baseUrl, token) {
		var bindedCallback = this._receivedMessageFromListener.bind(this);

		if (!baseUrl) {
			throw new Error('SwipesAPIConnector: No baseUrl set in constructor');
		}

		this._baseURL = baseUrl;
		this._apiUrl = baseUrl + '/v1/';
		this._token = token;
		this._hasInitialized = false;
		this._timeoutTimer = 10;
		this._timers = {};
		this._callbacks = {};
		this._listenerQueue = [];
		this._apiQueue = [];

		window.addEventListener('message', bindedCallback, false);
	};

	SwipesAPIConnector.prototype.setToken = function (token) {
		this._token = token;

		if (this._apiQueue.length > 0) {
			for (var i = 0; i < this._apiQueue.length; i++) {
				var request = this._apiQueue[i];

				this.callSwipesApi(request.options, request.data, request.callback, request.deferred);
			}

			this._apiQueue = [];
		}
	};

	SwipesAPIConnector.prototype.setId = function (id) {
		this._id = id;
	};

	SwipesAPIConnector.prototype.copyConnector = function () {
		var connector = new SwipesAPIConnector(this._baseURL, this._token);

		return connector;
	};

	SwipesAPIConnector.prototype.getBaseURL = function () {
		return this._baseURL;
	};

	SwipesAPIConnector.prototype.getAPIURL = function () {
		return this._apiUrl;
	};

	SwipesAPIConnector.prototype.setTargetURL = function (targetUrl) {
		this._targetUrl = targetUrl;
	};

	SwipesAPIConnector.prototype.setListener = function (listener, targetUrl) {
		// Test if listener is an object
		if(typeof listener !== 'object'){
			throw new Error('SwipesAPIConnector: Listener not an object');
		}

		// Test for required delegate methods
		if(typeof listener.postMessage !== 'function'){
			throw new Error('SwipesAPIConnector: Listener not responding to postMessage');
		}

		this._listener = listener;
		if(!targetUrl)
			targetUrl = window.location.origin;
		this.setTargetURL(targetUrl);
	};

	/*
		Delegate is the object that will handle calls through the listener ()
	*/
	SwipesAPIConnector.prototype.setDelegate = function (delegate) {
		// Test if delegate is an object
		if(typeof delegate !== 'object'){
			throw new Error('SwipesAPIConnector: Delegate not an object');
		}

		// Test for required delegate methods
		if(typeof delegate.connectorHandleResponseReceivedFromListener !== 'function'){
			throw new Error('SwipesAPIConnector: Delegate not responding to connectorHandleResponseReceivedFromListener');
		}
		this._delegate = delegate;
	};

	SwipesAPIConnector.prototype.callSwipesApi = function (options, data, callback, deferred) {
		if(!deferred && window.Q) {
			deferred = Q.defer();
		}

		var command,
				force;

		if(typeof options === 'string') {
			command = options;
		}

		if (typeof options === 'object') {
			command = options.command || null;
			force = options.force || false;
		}

		if (!this._token && !force) {
			this._apiQueue.push({options: options, data: data, callback: callback, deferred: deferred});

			return deferred.promise;
		}

		// If no data is send, but only a callback set those
		if (typeof data === 'function') {
			callback = data;
		}

		var url = this._apiUrl + command;

		if ((data == null) || typeof data !== 'object') {
			data = {};
		}

		data.token = this._token;

		var serData = JSON.stringify(data);
		var settings = {
			url: url,
			type: 'POST',
			success: function(data) {
				console.log('/' + command + ' success', data);
				if (data && data.ok) {
					if(typeof callback === 'function')
						callback(data);
					if(deferred) deferred.resolve(data);
				} else {
					if(typeof callback === 'function')
						callback(false, data);
					if(deferred) deferred.reject(data);
				}
			},
			error: function(error) {
				console.log('/' + command + ' error', error);
				if(error.responseJSON)
					error = error.responseJSON;
				if(typeof callback === 'function')
					callback(false, error);
				if(deferred) deferred.reject(error);
			},
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			context: this,
			data: serData,
			processData: true
		};
		$.ajax(settings);
		return deferred ? deferred.promise : false;
	};

	SwipesAPIConnector.prototype.callSwipesStreamApi = function (options, data, callback, deferred) {
		if(!deferred && window.Q) {
			deferred = Q.defer();
		}

		var command,
				force;

		if(typeof options === 'string') {
			command = options;
		}

		if (typeof options === 'object') {
			command = options.command || null;
			force = options.force || false;
		}

		// If no data is send, but only a callback set those
		if (typeof data === 'function') {
			callback = data;
		}

		var url = this._apiUrl + command;

		if ((data == null) || typeof data !== 'object') {
			data = {};
		}

		data.token = this._token;

		var serData = JSON.stringify(data);

		var xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);
		xhr.responseType = 'arraybuffer';
		xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

		xhr.onload = function(e) {
			var data = e.currentTarget.response;

			if(typeof callback === 'function')
				callback(data);
			if(deferred) deferred.resolve(data);
		};

		xhr.onerror = function(e) {
			console.log('/' + command + ' error', error);
			if(error.responseJSON)
				error = error.responseJSON;
			if(typeof callback === 'function')
				callback(false, error);
			if(deferred) deferred.reject(error);
		};

		xhr.send(serData);
	};

	SwipesAPIConnector.prototype.callListener = function(command, data, callback) {
		if(!this._token || !this._listener){
			console.log("listener queue", command);
			return this._listenerQueue.push({command: command, data: data, callback: callback});
		}

		var identifier = this._generateId();
		var callJson = {
			'identifier': identifier,
			'command': command,
			'data': data
		};

		if (this._id) {
			callJson._id = this._id;
		}

		if (callback && typeof callback === 'function') {
			this._callbacks[identifier] = callback;
		}

		this._sendMessageToListener(callJson);
	};

	SwipesAPIConnector.prototype._sendMessageToListener = function(json){
		if (!this._listener) {
			throw new Error('SwipesAPIConnector: _sendMessageToListener: No listener was set when trying to send message');
		}
		this._listener.postMessage(JSON.stringify(json), this._targetUrl);
	};

	SwipesAPIConnector.prototype._receivedMessageFromListener = function(msg) {
		try{
			var message = msg.data;

			if(typeof message === 'string') {
				message = JSON.parse(msg.data);
			}

			if(typeof message !== 'object') {
				return;
			}

			if (!this._id && message.identifier && message.command === "event" && message.data.type === "init") {
				var data = message.data.data;

				if(data.target_url) {
					this.setTargetURL(data.target_url);
				}

				if(data._id) {
					this.setId(data._id);
				}

				if(data.token) {
					this.setToken(data.token);
				}

				if (this._listenerQueue.length > 0) {
					for (var i = 0; i < this._listenerQueue.length; i++) {
						var listenObj = this._listenerQueue[i];

						this.callListener(listenObj.command, listenObj.data, listenObj.callback);
					}

					this._listenerQueue = [];
				}
			}
			if (message._id && message._id != this._id) {
				return;
			}

			if (message.reply_to) {
				this._runLocalCallback(message.reply_to, message.data, message.error);
			}
			else if (message.identifier) {
				if (!this._delegate) {
					return console.warn('SwipesAPIConnector: delegate not set when receiving message from app')
				}
				else{
					var _this = this;

					this._delegate.connectorHandleResponseReceivedFromListener(this, message, function(result, error){
						_this._respondMessageToListener(message.identifier, result, error);
					});
				}
			}
		}
		catch(err){
			console.log("error", err);
		}
	};

	SwipesAPIConnector.prototype._respondMessageToListener = function (identifier, data, error) {
		var callJson = {
			'ok': true,
			'reply_to': identifier
		};

		if(this._id)
			callJson._id = this._id;
		if(data){
			callJson.data = data;
		}
		else if(error){
			callJson.ok = false;
			callJson.error = error;
		}
		this._sendMessageToListener(callJson);
	}
	/*

	 */
	SwipesAPIConnector.prototype._runLocalCallback = function (identifier, res, err) {
		var callback = this._callbacks[identifier];

		if (callback) {
			callback(res, err);
		}

		this._clearCallback(identifier);
	};



	/*
		Clear out local callback and timer for identifier
	*/
	SwipesAPIConnector.prototype._clearCallback = function(identifier) {
		if (this._callbacks[identifier]) {
			delete this._callbacks[identifier];
		}

		if (this._timers[identifier]) {
			clearTimeout(this._timers[identifier]);
			delete this._timers[identifier];
		}
	};

	/*
		Function to generate random string to identify calls between frames for callbacks
	 */
	SwipesAPIConnector.prototype._generateId = function() {
		var length = 5;

		var text = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var i, j, ref;
		for (i = j = 0, ref = length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	};

	SwipesAPIConnector.prototype.destroy = function () {
		window.removeEventListener("message", this._receivedMessageFromApp, false);
		for (timer in this._timers) {
			if (!this._timers.hasOwnProperty(timer)) {
				continue;
			}
			clearTimeout(this._timers[timer]);
			//Do your logic with the property here
		}
	}

	return SwipesAPIConnector;
})();
