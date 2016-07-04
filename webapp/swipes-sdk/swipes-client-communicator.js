var SwClientCom = (function () {
	function SwClientCom(delegate, target, initObj) {
		this._callbacks = {};
		this._listenerQueue = [];
		this._isLocked = false;

		if(delegate){
			this.setDelegate(delegate);
		}
		if(target){
			this.setTarget(target);
		}
		if(initObj){
			this.sendMessage('init', initObj);
		}
	};
	SwClientCom.prototype.isLocked = function(){
		return this._isLocked;
	};
	SwClientCom.prototype.lock = function(){
		this._isLocked = true;
	};
	SwClientCom.prototype.unlock = function(){
		this._isLocked = false;
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
		if(typeof delegate.handleReceivedMessage !== 'function'){
			throw new Error('SwClientCom: Delegate not responding to handleReceivedMessage');
		}
		this._delegate = delegate;
	};

	SwClientCom.prototype.sendMessage = function(command, data, callback) {
		if(this._isLocked || !this._target){
			return this._listenerQueue.push({command: command, data: data, callback: callback});
		}

		var identifier = this._generateRandomSenderId();
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

	SwClientCom.prototype.receivedMessageFromTarget = function(message) {
		if(typeof message !== 'object') {
			return;
		}

		if (message.identifier && this._delegate) {
			this._delegate.handleReceivedMessage(message, function(result, error){
				this._generateAndSendCallbackToTarget(message.identifier, result, error);
			}.bind(this));
		}
		else if (message.reply_to && this._callbacks[message.reply_to]) {
			this._callbacks[message.reply_to](message.data, message.error);
			delete this._callbacks[message.reply_to];
		}
	};

	SwClientCom.prototype._generateAndSendCallbackToTarget = function (identifier, data, error) {
		var responseJson = {
			'ok': true,
			'reply_to': identifier
		};

		if(data){
			responseJson.data = data;
		}
		else if(error){
			responseJson.ok = false;
			responseJson.error = error;
		}

		this._target.postMessage(responseJson);
	}

	/*
		Function to generate random string to identify calls between frames for callbacks
	 */
	SwClientCom.prototype._generateRandomSenderId = function() {
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
