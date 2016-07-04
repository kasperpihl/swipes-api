var SwClientCom = (function () {
	function SwClientCom(delegate, isConnected) {
		this._callbacks = {};
		this._listenerQueue = [];
		this._isConnected = (isConnected);

		if(delegate){
			this.setDelegate(delegate);
		}
	};

	/*
		Delegate will be sending messages and handling the parsed received messages
	*/
	SwClientCom.prototype.setConnected = function(){
		this._isConnected = true;
		if (this._listenerQueue.length > 0) {
			for (var i = 0; i < this._listenerQueue.length; i++) {
				var listenObj = this._listenerQueue[i];
				this.sendMessage(listenObj.command, listenObj.data, listenObj.callback);
			}

			this._listenerQueue = [];
		}
	};

	SwClientCom.prototype.setTarget = function(target){
		if(typeof target.postMessage !== 'function'){
			throw new Error('SwClientCom: Target not responding to postMessage');
		}
		this._target = target;
	}

	SwClientCom.prototype.setDelegate = function (delegate) {
		if(typeof delegate.hanleReceivedMessage !== 'function'){
			throw new Error('SwClientCom: Delegate not responding to handleReceivedMessage');
		}
		this._delegate = delegate;
	};

	SwClientCom.prototype.sendMessage = function(command, data, callback) {
		if(!this._isConnected){
			return this._listenerQueue.push({command: command, data: data, callback: callback});
		}

		var identifier = this._generateId();
		var callJson = {
			'identifier': identifier,
			'data': data,
			'command': command
		};

		if (callback && typeof callback === 'function') {
			this._callbacks[identifier] = callback;
		}
		this._target.postMessage(callJson);
	};

	SwClientCom.prototype.receivedMessage = function(message) {
		if(typeof message !== 'object') {
			return;
		}

		if (message.reply_to && this._callbacks[message.reply_to]) {
			this._callbacks[message.reply_to](message.data, message.error);
			delete this._callbacks[identifier];
		}
		else if (message.identifier) {
			if (this._delegate) {
				this._delegate.handleReceivedMessage(this, message, function(result, error){
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

		this._target.postMessage(callJson);
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
