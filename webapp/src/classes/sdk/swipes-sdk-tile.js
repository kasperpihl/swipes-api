import SwipesAPIConnector from './swipes-sdk-rest-api'
import SwClientCom from './swipes-sdk-ipc'

export default class SwipesAppSDK {
  constructor(sendFunction){
    let apiUrl = window.location.origin;
    this.api = new SwipesAPIConnector(apiUrl);

    this.info = {}; // initObj.info from tile_loader will be this after init.

    this.com = new SwClientCom(sendFunction);
    
    this.com.lock(); // Lock until init from the workspace, this will queue all calls and fire them once ready (init calls unlock);
    this.addListener('init', (data) => {
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
  saveData(data, options, callback){
    if(typeof options === 'function'){
      callback = options;
      options = null;
    }
    this.sendEvent('tile.saveData', {data, options}, callback);
  }

  isShareURL(url){
    url = url || "";
    const shareURLPrefix = window.location.origin + '/s/';
    if(url.startsWith(shareURLPrefix)){
      return true;
    }
    return false;
  }


  // Shorthands for contacting service api
  getRequestOptions(serviceName, method, parameters) {
    if(!method || typeof method !== 'string' || !method.length){
      throw new Error("SwipesAppSDK: service:request method required");
    }
    if(typeof parameters === 'function'){
      callback = parameters;
    }
    parameters = (typeof parameters === 'object') ? parameters : {};
    
    const options = {
      service: serviceName,
      data: {
        method: method,
        parameters: parameters
      }
    };

    if(this.info.workflow && this.info.workflow.selectedAccountId){
      options.account_id = this.info.workflow.selectedAccountId;
    }
    
    return options;
  }
  do(data, callback){
    return this._apiRequest('steps.do', data, callback);
  }
  complete(){

  }
  service(serviceName){
    return {
      request: (method, parameters, callback) => {
        const options = this.getRequestOptions(serviceName, method, parameters)
        return this._apiRequest('services.request', options, callback);
      },
      stream: (method, parameters, callback) => {
        const options = this.getRequestOptions(serviceName, method, parameters);
        options.stream = true;
        // T_TODO: Turned off the stream here, because it keeps running and trying
        //return this._apiRequest("services.stream", options, callback);
      }
    };
  }
  modal(modal){
    let modals = {
      edit: (title, message, callback) => {
        let options = {};
        options = this._getModalOptions(options, title, message);
        this._loadModal("textarea", options, function(res){
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
          var confirmed = (res && res.button === 1);
          if(typeof callback === 'function')
            callback(confirmed);
        })
      },
      custom: (type, props, callback) => {
        this._loadModal(type, props, callback);
      }
    };
    return modals[modal] || modals['custom'].apply(this, arguments);
  }

  _loadModal(name, props, callback){
    props = props || {};
    if(typeof props === 'function'){
      callback = props;
      props = {};
    }
    this.sendEvent({async: true, command: "modal.load"}, {modal: name, props: props}, callback);
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

  _apiRequest(method, options, callback){
    return new Promise((resolve, reject) => {
      var intCallback = function(res, error){
        if(callback) callback(res,error);
        if(res) resolve(res);
        else resolve({ok: false, err: error});
      };
      this.api.request(method, options, intCallback);
    })
  }
}
