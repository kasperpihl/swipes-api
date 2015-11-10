var SwipesAPIConnector = (function() {
	function SwipesAPIConnector(apiUrl, token) {
		_.bindAll(this, "_receivedMessageFromApp")
		if (!apiUrl){
			throw new Error("SwipesAPIConnector: No apiUrl set in constructor");
		}
		if (!token) {
			throw new Error("SwipesAPIConnector: No token set in constructor");
		}
		this._baseUrl = apiUrl + "/v1/";
		this._token = token;
		

		this._timeoutTimer = 10;

		this._timers = {};
		this._callbacks = {};
		window.addEventListener("message", this._receivedMessageFromApp, false);
	}
	

	SwipesAPIConnector.prototype.callSwipesApi = function(command, options, callback) {
		
		var url = this._baseURL + command;
		if ((options == null) || !_.isObject(options)) {
			options = {};
		}
		options.token = this._token;
		var serData = JSON.stringify(options);
		var settings = {
			url: url,
			type: 'POST',
			success: function(data) {
				console.log("swipes api success", data);
				if (data && data.ok) {
					return typeof callback === "function" ? callback(data) : void 0;
				} else {
					return typeof callback === "function" ? callback(false, data) : void 0;
				}
			},
			error: function(error) {
			console.log("swipes api error", error);
				return typeof callback === "function" ? callback(false, error) : void 0;
			},
			crossDomain: true,
			contentType: "application/json; charset=utf-8",
			context: this,
			data: serData,
			processData: true
		};

		return $.ajax(settings);
	};

	/*
	
	 */
	SwipesAPIConnector.prototype.callMainApp = function(command, data, callback) {
		
		console.log("client call to main app", command, data);

		if (!this._doc) {
			throw new Error("SwipesAPIConnector: callMainApp: No doc/iframe set");
		}
		var identifier = this.generateId();
		var callJson = {
			"identifier": identifier,
			"command": command,
			"data": data
		};
		if (callback && _typeof callback === 'function') {
			this._addCallback(identifier, callback);
		}
		this._doc.postMessage(JSON.stringify(callJson), this._url);

	};

	SwipesAPIConnector.prototype._receivedMessageFromApp = function(msg) {
		var message = JSON.parse(msg.data);
		if (message.reply_to) {
			this._runLocalCallback(message.reply_to, message.data, message.error);
		}
		else if(message.identifier){
			this._sdk.handleLowLevelCall(message);
		}
	};


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
				_this._runLocalCallback(identifier, null, "Timed out");
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
	SwipesAPIConnector.prototype.generateId = function() {
		var length = 5;

		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		var i, j, ref;
		for (i = j = 0, ref = length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	};

	return SwipesAPIConnector;

})();