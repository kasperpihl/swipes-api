
var SwClientCom = (function () {
	function SwClientCom(delegate) {
		this._callbacks = {};
		this._listenerQueue = [];
		if(delegate){
			this.setDelegate(delegate);
		}
	};

	/*
		Delegate will be sending messages and handling the parsed received messages
	*/
	SwClientCom.prototype.setDelegate = function (delegate) {
		// Test if delegate is an object
		if(typeof delegate !== 'object'){
			throw new Error('SwClientCom: Delegate not an object');
		}

		if(typeof delegate.communicatorSendMessage !== 'function'){
			throw new Error('SwClientCom: Delegate not responding to communicatorSendMessage');
		}

		// Test for required delegate methods
		if(typeof delegate.communicatorReceivedMessage !== 'function'){
			throw new Error('SwClientCom: Delegate not responding to communicatorReceivedMessage');
		}
		this._delegate = delegate;
	};

	SwClientCom.prototype.sendMessage = function(data, callback) {
		if(!this._delegate){
			console.log("listener queue", command);
			return this._listenerQueue.push({data: data, callback: callback});
		}

		var identifier = this._generateId();
		var callJson = {
			'identifier': identifier,
			'data': data
		};

		if (callback && typeof callback === 'function') {
			this._callbacks[identifier] = callback;
		}
		this._delegate.communicatorSendMessage(this, callJson);
	};

	SwClientCom.prototype.receivedMessage = function(message) {
		if(typeof message !== 'object') {
			return;
		}

		if (this._listenerQueue.length > 0) {
			for (var i = 0; i < this._listenerQueue.length; i++) {
				var listenObj = this._listenerQueue[i];

				this.sendMessage(listenObj.data, listenObj.callback);
			}

			this._listenerQueue = [];
		}

		if (message.reply_to && this._callbacks[message.reply_to]) {
			this._callbacks[message.reply_to](message.data, message.error);
			delete this._callbacks[identifier];
		}
		else if (message.identifier) {
			if (this._delegate) {
				this._delegate.communicatorReceivedMessage(this, message, function(result, error){
					this._replyToMessage(message.identifier, result, error);
				}.bind(this));
			}
		}
	};

	SwClientCom.prototype._replyToMessage = function (identifier, data, error) {
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

		this._delegate.communicatorSendMessage(this, callJson);
	}

	/*
		Function to generate random string to identify calls between frames for callbacks
	 */
	SwClientCom.prototype._generateId = function() {
		var length = 5;

		var text = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var i, j, ref;
		for (i = j = 0, ref = length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	};

	return SwClientCom;
})();
