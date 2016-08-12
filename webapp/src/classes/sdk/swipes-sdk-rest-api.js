export default class SwipesAPIConnector {
  constructor(baseUrl, token) {

    this._baseURL = baseUrl;
    this._apiUrl = baseUrl + '/v1/';
    this._token = token;
    this._apiQueue = [];

  }

  setToken(token) {
    this._token = token;
    this._apiQueue.forEach( (r) => {
      this.callSwipesApi(r.options, r.data, r.callback, r.deferred);
    })
    this._apiQueue = [];
  };
  getToken() {
    return this._token;
  }
  getBaseURL() {
    return this._baseURL;
  }

  getAPIURL() {
    return this._apiUrl;
  };

  request(options, data, callback, deferred) {
    if(!deferred && window.Q) {
      deferred = Q.defer();
    }

    var command, force;

    if(typeof options === 'string') {
      command = options;
    }

    if (typeof options === 'object') {
      command = options.command || null;
      force = options.force || false;
    }
    if (!this._token && !force) {
      this._apiQueue.push({options: options, data: data, callback: callback, deferred: deferred});

      return deferred.promise;
    }
    // If no data is send, but only a callback set those
    if (typeof data === 'function') {
      callback = data;
    }

    var url = this._apiUrl + command;

    if ((data == null) || typeof data !== 'object') {
      data = {};
    }

    data.token = this._token;

    var serData = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.responseType = 'json'
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

    xhr.onload = function(e) {
      var data = e.currentTarget.response;

      console.log('/' + command + ' success', data);
      if (data && data.ok) {
        if(typeof callback === 'function')
          callback(data);
        if(deferred) deferred.resolve(data);
      } else {
        if(typeof callback === 'function')
          callback(false, data);
        if(deferred) deferred.reject(data);
      }
    };

    xhr.onerror = function(e) {
      console.log(e);
      var error = e; //T_TODO make sure that the `e` is actually the error
      console.log('/' + command + ' error', error);
      if(error.responseJSON)
        error = error.responseJSON;
      if(typeof callback === 'function')
        callback(false, error);
      if(deferred) deferred.reject(error);
    };

    xhr.send(serData);
    return deferred ? deferred.promise : false;
  }

  streamRequest(options, data, callback, deferred) {
    if(!deferred && window.Q) {
      deferred = Q.defer();
    }

    var command,
        force;

    if(typeof options === 'string') {
      command = options;
    }

    if (typeof options === 'object') {
      command = options.command || null;
      force = options.force || false;
    }

    // If no data is send, but only a callback set those
    if (typeof data === 'function') {
      callback = data;
    }

    var url = this._apiUrl + command;

    if ((data == null) || typeof data !== 'object') {
      data = {};
    }

    data.token = this._token;

    var serData = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

    xhr.onload = function(e) {
      var data = e.currentTarget.response;

      if(typeof callback === 'function')
        callback(data);
      if(deferred) deferred.resolve(data);
    };

    xhr.onerror = function(e) {
      console.log('/' + command + ' error', error);
      if(error.responseJSON)
        error = error.responseJSON;
      if(typeof callback === 'function')
        callback(false, error);
      if(deferred) deferred.reject(error);
    };

    xhr.send(serData);
  }
}
