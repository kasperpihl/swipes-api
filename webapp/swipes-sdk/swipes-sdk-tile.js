class SwipesAppSDK {
  constructor(){
    let apiUrl = window.location.origin;
    this.api = new SwipesAPIConnector(apiUrl);
    this.info = {}; // initObj.info from tile_loader will be this after init.

    // workspaceSendFunction is defined in the preload
    this.com = new SwClientCom(workspaceSendFunction);
    this.com.lock(); // Lock until init from the workspace, this will queue all calls and fire them once ready (init calls unlock);
    this.com.addListener('init', (data) => {
      if(data.token) {
        this.api.setToken(data.token);
      }
      if(data.info){
        this.info = data.info;
      }
      // Now let's unlock the communicator since the connection from the workspace is ready
      if(this.com.isLocked()){
        this.com.unlock();
      }
    });
  }
  // Shorthand for getting the init event
  ready(callback){
    this.addListener("init", callback);
  }
  // Add listener to events sent from workspace
  addListener(command, listener, ctx){
    this.com.addListener(command, listener, ctx);
  }
  // Remove listener from events sent from workspace
  removeListener(command, listener, ctx){
    this.com.removeListener(command, listener, ctx);
  }
  // Send events to the workspace
  sendEvent(command, data, callback){
    this.com.sendCommand(command, data, callback);
  }

  // Shorthands for contacting service api
  service(serviceName){
    return {
      request: (method, parameters, callback) => {
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

        if(this.info.workflow && this.info.workflow.selectedAccountId){
          options.account_id = this.info.workflow.selectedAccountId;
        }

        var intCallback = function(res, error){
          if(callback) callback(res,error);
          if(res) deferred.resolve(res);
          else deferred.reject(error);
        };

        this.api.request("services.request", options, intCallback);
        return deferred.promise;
      },
      stream: (method, parameters, callback) => {
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

        this.api.streamRequest("services.stream", options, intCallback);
        return deferred.promise;
      }
    };
  }
  modal(modal){
    let modals = {
      edit: (title, message, callback) => {
        let options = {};
        options = this._getModalOptions(options, title, message);
        this._loadMdal("textarea", options, function(res){
          if(typeof callback === 'function')
            callback(res);
        })
      },
      schedule: (callback) => {
        this._loadModal("schedule", function(res) {
          if(typeof callback === 'function') {
            callback(res)
          }
        })
      },
      lightbox: (src, title, url) => {
        title = title || '';
        url = url || '';

        var options = {
          src: src,
          title: title,
          url: url
        };

        this._loadModal("lightbox", options)
      },
      alert: (title, message, callback) => {
        var options = {buttons: ["Okay"]};
        options = this._getModalOptions(options, title, message);

        if(typeof title === 'function'){
          callback = title;
        }
        if(typeof message === 'function'){
          callback = message;
        }

        this._loadModal("alert", options, function(res){
          if(typeof callback === 'function')
            callback(res);
        })
      },
      confirm: (title, message, callback) => {
        var options = {buttons: ["No", "Yes"]};
        options = this._getModalOptions(options, title, message);

        if(typeof title === 'function'){
          callback = title;
        }
        if(typeof message === 'function'){
          callback = message;
        }

        this._loadModal("alert", options, function(res){
          var confirmed = (res && res.button === 2);
          if(typeof callback === 'function')
            callback(confirmed);
        })
      }
    };
    return modals[modal] || modals['alert'];
  }
  _loadModal(name, options, callback){
    options = options || {};
    if(typeof options === 'function'){
      callback = options;
      options = {};
    }
    this.sendEvent("modal.load", {modal: name, options: options}, callback);
  }
  _getModalOptions(options, title, message){
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
  }
}
