/*
	Swipes Client Communicator
	The purpose of this class is to stucture the communication between tile and workspace.
	sendFunction in the constructor should be a function that take its first parameter and send it to a receiver (workspace/tile)
 */
var SwClientCom = (function () {
	function SwClientCom(sendFunction, initObj) {
		this._localCallbacks = {}; // 
		this._commandQueue = []; // Queue of commands, if called while locked
		this._listenersObj = {}; // Listeners of commands 
		this._isLocked = false; // Lock state, to not pass on any commands

		if(typeof sendFunction !== 'function'){
			throw new Error('SwClientCom: sendFunction must be a function taking one parameter: data');
		}
		this._sendFunction = sendFunction;
		if(initObj){
			this.sendCommand('init', initObj);
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
		if (this._commandQueue.length > 0) {
			for (var i = 0; i < this._commandQueue.length; i++) {
				var listenObj = this._commandQueue[i];
				this.sendCommand(listenObj.command, listenObj.data, listenObj.callback);
			}

			this._commandQueue = [];
		}
	};

	SwClientCom.prototype.sendCommand = function(command, data, callback) {
		if(this._isLocked){
			return this._commandQueue.push({command: command, data: data, callback: callback});
		}

		if(typeof command !== 'string' || !command.length){
			return console.warn('SwClientCom: sendCommand first parameter must be a string');
		}
		// If data is a function, it's shorthand for the callback
		if(typeof data === 'function'){
			callback = data;
			data = null;
		}

		var identifier = this._generateRandomSenderId();
		var callJson = {
			'identifier': identifier,
			'data': data,
			'command': command
		};

		if (callback && typeof callback === 'function') {
			this._localCallbacks[identifier] = callback;
		}
		this._sendFunction(callJson);
	};

	SwClientCom.prototype.receivedCommand = function(message) {
		if(typeof message !== 'object') {
			return;
		}

		if (message.identifier && message.command) {
			var res = null;
			// When receiving a command, check if any listeners have been attached and call them.
			var listeners = this.getListeners(message.command);
			for (var i = 0 ; i < listeners.length ; i++) {
				var handler = listeners[i].listener;
				if(handler) {
					// Limitation, only the last callback added will return a result to callback
					res = handler(message.data);
				}
			}
			// Then generate a response with whatever result was returned from the last listener
			this._generateAndSendResponseToCommand(message.identifier, res);
		}
		// Else if receiving the reply from a command, check the local callbacks.
		else if (message.reply_to && this._callbacks[message.reply_to]) {
			this._localCallbacks[message.reply_to](message.data);
			delete this._localCallbacks[message.reply_to];
		}
	};

	SwClientCom.prototype._generateAndSendResponseToCommand = function (identifier, data) {

		var responseJson = {
			'reply_to': identifier,
			'data': data
		};

		this._sendFunction(responseJson);
	}

	// Internal listener api, used for handling received events
	SwClientCom.prototype.addListener = function(command, listener, ctx){
		if(!command || typeof command !== 'string'){
			return console.warn('SwClientCom: addListener param1 (command): not set or not string');
		}
		if(!listener || typeof listener !== 'function'){
			return console.warn("SwClientCom: addListener param2 (listener): not set or not function");
		}
		var currentListeners = this._listenersObj[command] || [];
		ctx = ctx || "";

		currentListeners.push({listener: listener, context: ctx});
		this._listenersObj[command] = currentListeners;
	};
	SwClientCom.prototype.getListeners = function(command){
		var currentListeners = this._listenersObj[command] || [];
		return currentListeners;
	};
	SwClientCom.prototype._removeListenersForCommand = function(command, listener, ctx){
		var currentListeners = this._listenersObj[command];
		if(!currentListeners){
			return;
		}
		// If only event name is provided, remove all
		if(!listener && !ctx){
			return delete this._listenersObj[command];
		}

		var newListeners = [];
		for(var i = 0 ; i < currentListeners.length ; i++){
			var listener = currentListeners[i];
			if(listener.listener !== listener && listener.context !== ctx)
				newListeners.push(listener);
		}
		if(!newListeners.length){
			return delete this._listenersObj[command];
		}
		else if(newListeners.length && newListeners.length !== currentListeners.length){
			this._listenersObj[command] = newListeners;
		}
	};
	SwClientCom.prototype.removeListener = function(command, listener, ctx){
		if(!command && !listener && !ctx){
			return console.warn('SwClientCom: removeListener: no params provided');
		}
		if(command){
			this._removeListenersForCommand(command, listener, context);
		}
		else{
			for(var key in this._listenersObj){
				this._clearEventName(key, listener, context);
			}
		}
	};
	
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