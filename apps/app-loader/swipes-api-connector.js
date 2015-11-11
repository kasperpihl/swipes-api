var SwipesAPIConnector = (function() {
	function SwipesAPIConnector(apiUrl, token) {
		var bindedCallback = this._receivedMessageFromListener.bind(this)
		if (!apiUrl){
			throw new Error('SwipesAPIConnector: No apiUrl set in constructor');
		}

		this._baseUrl = apiUrl + '/v1/';
		this._token = token;
		

		this._timeoutTimer = 10;

		this._timers = {};
		this._callbacks = {};

		window.addEventListener('message', bindedCallback, false);

	};
	SwipesAPIConnector.prototype.setListener = function(listener){
		// Test if listener is an object
		if(typeof listener !== 'object'){
			throw new Error('SwipesAPIConnector: Listener not an object');
		}

		// Test for required delegate methods
		if(typeof listener.postMessage !== 'function'){
			throw new Error('SwipesAPIConnector: Listener not responding to postMessage');
		}
		this._listener = listener;
	};

	/* 
		Delegate is the object that will handle calls through the listener ()
	*/
	SwipesAPIConnector.prototype.setDelegate = function(delegate){

		// Test if delegate is an object
		if(typeof delegate !== 'object'){
			throw new Error('SwipesAPIConnector: Delegate not an object');
		}

		// Test for required delegate methods
		if(typeof delegate.handleLowLevelCallFromConnector !== 'function'){
			throw new Error('SwipesAPIConnector: Delegate not responding to handleLowLevelCallFromConnector');
		}
		this._delegate = delegate;
	};

	SwipesAPIConnector.prototype.callSwipesApi = function(options, data, callback) {
		var command, method = 'POST';
		if(typeof options === 'string')
			command = options;
		if(typeof options === 'object'){
			if(options.method)
				method = options.method;
		}
		var url = this._baseURL + command;
		if ((data == null) || !_.isObject(data)) {
			data = {};
		}
		if(this._token){
			data.token = this._token;
		}

		var serData = JSON.stringify(data);
		var settings = {
			url: url,
			type: 'POST',
			success: function(data) {
				console.log('swipes api success', data);
				if (data && data.ok) {
					return typeof callback === 'function' ? callback(data) : void 0;
				} else {
					return typeof callback === 'function' ? callback(false, data) : void 0;
				}
			},
			error: function(error) {
				console.log('swipes api error', error);
				return typeof callback === 'function' ? callback(false, error) : void 0;
			},
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			context: this,
			data: serData,
			processData: true
		};

		return $.ajax(settings);
	};

	/*
	
	 */
	SwipesAPIConnector.prototype.callMainApp = function(command, data, callback) {
		
		console.log('client call to main app', command, data);

		var identifier = this._generateId();
		var callJson = {
			'identifier': identifier,
			'command': command,
			'data': data
		};
		if (callback && typeof callback === 'function') {
			this._addCallback(identifier, callback);
		}

		
		this._sendMessageToListener(callJson);
	};


	SwipesAPIConnector.prototype._sendMessageToListener = function(json){
		if (!this._listener) {
			throw new Error('SwipesAPIConnector: _sendMessageToListener: No listener was set when trying to send message');
		}
		this._listener.postMessage(JSON.stringify(callJson), this._url);
	};


	SwipesAPIConnector.prototype._receivedMessageFromListener = function(msg) {
		var message = JSON.parse(msg.data);
		if (message.reply_to) {
			this._runLocalCallback(message.reply_to, message.data, message.error);
		}
		else if(message.identifier){
			if(!this._delegate){
				return console.warn('SwipesAPIConnector: delegate not set when receiving message from app')
			}
			else{
				var _this = this;
				this._delegate.handleLowLevelCallFromConnector(this, message, function(result, error){
					_this._respondMessageToListener(message.identifier, result, error);
				});
			}
		}
	};

	SwipesAPIConnector.prototype._respondMessageToListener = function(identifier, data, error){
		var callJson = {
			'ok': true,
			'reply_to': identifier
		};
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
	SwipesAPIConnector.prototype._runLocalCallback = function(identifier, res, err) {
		var callback = this._callbacks[identifier];
		if (callback) {
			callback(res, err);
		}
		this._clearCallback(identifier);
	};



	/*
		Add callback for an identifier and set timeout to clear if not called before
	*/
	SwipesAPIConnector.prototype._addCallback = function(identifier, callback) {
		this._callbacks[identifier] = callback;
		var _this = this;
		this._timers[identifier] = setTimeout(function() {
			if ((_this != null) && _this._callbacks[identifier]) {
				_this._runLocalCallback(identifier, null, 'Timed out');
			}
		}, this._timeoutTimer * 1000);
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

	return SwipesAPIConnector;

})();