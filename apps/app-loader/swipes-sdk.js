var SwipesSDK = (function() {
	var self;
	function SwipesSDK(client) {
		console.log("client", client);
		this._client = new client("te");
		self = this;
	}

	// API for navigation bar in main app
	SwipesSDK.prototype.navigation = {
		// Setting the title of the navigation bar manually
		setTitle:function(title){
			console.log("new title", _this, swipes);
			_this._client.callApi("navigation.setTitle",{})
		},
		// Push new title (view), will show a backbutton.
		push: function(title, identifier){

		},
		// Pops back one title
		pop: function(){

		},
		setColors:function(backgroundColor, foregroundColor){
			
		}
	};

	SwipesSDK.prototype.api = {
		get:function(options, callback){

		},
		save: function(options, saveData, callback){
			
			_this._client.callApi("api.save")
		}
	};

	return SwipesSDK;

})();











function swipesGenerateId(length) {
	var i, j, possible, ref, text;
	text = "";
	possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (i = j = 0, ref = length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};
var SwipesLowLevelAPIConnector = (function() {
	function SwipesLowLevelAPIConnector(url) {
		_.bindAll(this, "_receivedMessageFromApp")
		if (!url) {
			throw new Error("No url set in constructor");
		}

		this._url = url;
		this._timeoutTimer = 1;
		this._timers = {};
		this._callbacks = {};
		window.addEventListener("message", this._receivedMessageFromApp, false);
	}

	SwipesLowLevelAPIConnector.prototype.callApi = function(command, data, callback) {
		
		var callJson, identifier;
		console.log("_api call", command, data);

		if (!this._doc) {
			throw new Error("No doc/iframe set");
		}
		identifier = generateId(5);
		callJson = {
			"identifier": identifier,
			"command": command,
			"data": data
		};
		if (callback && _.isFunction(callback)) {
			this._addCallback(identifier, callback);
		}
		this._doc.postMessage(JSON.stringify(callJson), this._url);

	};

	SwipesLowLevelAPIConnector.prototype._receivedMessageFromApp = function(msg) {
		var message;
		message = JSON.parse(msg.data);
		if (message.reply_to) {
			this._doCallback(message.reply_to, message.data, message.error);
		}
	};

	SwipesLowLevelAPIConnector.prototype._doCallback = function(identifier, res, err) {
		var callback;
		console.log("callback iframe", identifier, res, err);
		callback = this._callbacks[identifier];
		if (callback) {
			callback(res, err);
		}
		this._clearCallback(identifier);
	};


	/*
	Add callback for an identifier and set timeout to clear if not called before
	*/

	SwipesLowLevelAPIConnector.prototype._addCallback = function(identifier, callback) {
		this._callbacks[identifier] = callback;
		var _this = this;
		this._timers[identifier] = setTimeout(function() {
			if ((_this != null) && _this._callbacks[identifier]) {
				_this._doCallback(identifier, null, "Timed out");
			}
		}, this._timeoutTimer * 1000);
	};


	/*
	Clear out callbacks and timers
	*/

	SwipesLowLevelAPIConnector.prototype._clearCallback = function(identifier) {
		if (this._callbacks[identifier]) {
			delete this._callbacks[identifier];
		}
		if (this._timers[identifier]) {
			clearTimeout(this._timers[identifier]);
			delete this._timers[identifier];
		}
	};

	return SwipesLowLevelAPIConnector;

})();
window.swipes = new SwipesSDK(SwipesLowLevelAPIConnector);