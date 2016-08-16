/*
  Swipes Client Communicator
  The purpose of this class is to stucture the communication between tile and workspace.
  sendFunction in the constructor should be a function that take its first parameter and send it to a receiver (workspace/tile)
 */
export default class SwClientCom {
  constructor(sendFunction, initObj) {
    this._localCallbacks = {}; // 
    this._commandQueue = []; // Queue of commands, if called while locked
    this._listenersObj = {}; // Listeners of commands 
    this._isLocked = false; // Lock state, to not pass on any commands

    if(typeof sendFunction !== 'function'){
      throw new Error('SwClientCom: sendFunction must be a function taking one parameter: data');
    }
    this.receivedCommand = this.receivedCommand.bind(this);

    this._sendFunction = sendFunction;
    if(initObj){
      // Hack to send initObj after the class has been made, but still leave it in constructor.
      setTimeout(() => {
        this.sendCommand('init', initObj);
      }, 1);
    }
  }
  isLocked(){
    return this._isLocked
  }
  lock(){
    this._isLocked = true
  }
  unlock(){
    this._isLocked = false
    this._commandQueue.forEach((listenObj) => {
      this.sendCommand(listenObj.command, listenObj.data, listenObj.callback)
    })
    this._commandQueue = []
  }

  sendCommand(command, data, callback) {
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
  }

  receivedCommand(message) {
    if(typeof message !== 'object') {
      return;
    }
    // Check if it's a command, or reply to a command.
    if (message.command) {
      var res = null;
      // When receiving a command, check if any listeners have been attached and call them.
      this.getListeners(message.command).forEach(({ listener }) => {
        res = listener(message.data);
      })
      
      // Then generate a response with whatever result was returned from the last listener
      this._generateAndSendResponseToCommand(message.identifier, res);
    }
    // Else if receiving the reply from a command, check the local callbacks.
    else if (message.reply_to) {
      if(this._localCallbacks[message.reply_to]){
        this._localCallbacks[message.reply_to](message.data);
        delete this._localCallbacks[message.reply_to];
      }
    }
  }

  _generateAndSendResponseToCommand(identifier, data) {

    var responseJson = {
      'reply_to': identifier,
      'data': data
    };

    this._sendFunction(responseJson);
  }

  addListeners(commands, listener, ctx){
    if(Array.isArray(commands)){
      commands.forEach((command) => {
        this.addListener(command, listener, ctx);
      })
    }
  }
  // Internal listener api, used for handling received events
  // Supports context as the third parameter
  addListener(command, listener, ctx){
    if(!command || typeof command !== 'string'){
      return console.warn('SwClientCom: addListener param1 (command): not set or not string');
    }
    if(!listener || typeof listener !== 'function'){
      return console.warn("SwClientCom: addListener param2 (listener): not set or not function");
    }
    if(typeof ctx !== 'string'){
      ctx = '';
    }

    var currentListeners = this._listenersObj[command] || [];
    currentListeners.push({listener: listener, context: ctx});
    this._listenersObj[command] = currentListeners;
  }
  getListeners(command){
    var currentListeners = this._listenersObj[command] || [];
    return currentListeners;
  }
  _removeListenersForCommand(command, listener, ctx){
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
  }
  removeListener(command, listener, ctx){
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
  }
  
  /*
    Function to generate random string to identify calls between frames for callbacks
   */
  _generateRandomSenderId() {
    var length = 5, text = '', possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0 ; i < length ; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}